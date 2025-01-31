package repository

import (
	"backend/config"
	"backend/internal/models"
	"database/sql"
	"fmt"
	"strings"
)

type MatchRepository struct {
	db *sql.DB
}

func NewMatchRepository(db *sql.DB) *MatchRepository {
	return &MatchRepository{db: db}
}

func (r *MatchRepository) InsertMatches(matches []models.Match) error {
	if len(matches) == 0 {
		return nil
	}

	for i := 0; i < len(matches); i += config.BATCH_SIZE {
		end := i + config.BATCH_SIZE
		if end > len(matches) {
			end = len(matches)
		}

		if err := r.insertBatch(matches[i:end]); err != nil {
			return fmt.Errorf("error inserting batch matches: %w", err)
		}
	}

	return nil
}

func (r *MatchRepository) insertBatch(batch []models.Match) error {
	if len(batch) == 0 {
		return nil
	}

	values := make([]string, len(batch))
	args := make([]interface{}, len(batch)*3)
	argID := 1

	for i, match := range batch {
		match.UserEmail, match.UserEmailMatched = normalizeEmails(match.UserEmail, match.UserEmailMatched)

		values[i] = fmt.Sprintf("($%d, $%d, $%d)", argID, argID+1, argID+2)
		args[argID-1] = match.UserEmail
		args[argID] = match.UserEmailMatched
		args[argID+1] = match.Compatibility
		argID += 3
	}

	query := fmt.Sprintf(`
		INSERT INTO matches (email_user1, email_user2, compatibility)
		VALUES %s
		ON CONFLICT (email_user1, email_user2) DO NOTHING;
	`, strings.Join(values, ", "))

	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	_, err = tx.Exec(query, args...)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error inserting matches: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func normalizeEmails(email1, email2 string) (string, string) {
	if strings.Compare(email1, email2) < 0 {
		return email1, email2
	}
	return email2, email1
}

func (r *MatchRepository) GetMatchAverage() (float64, error) {
	query := `
		SELECT AVG(match_count)
		FROM (
			SELECT email_user1, COUNT(*) AS match_count
			FROM matches
			GROUP BY email_user1
		) AS match_counts;
	`

	var average float64
	if err := r.db.QueryRow(query).Scan(&average); err != nil {
		return 0, fmt.Errorf("error getting match average: %w", err)
	}

	return average, nil
}
