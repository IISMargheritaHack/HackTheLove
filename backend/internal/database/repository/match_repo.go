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
		match.UserEmail1, match.UserEmail2 = normalizeEmails(match.UserEmail1, match.UserEmail2)

		values[i] = fmt.Sprintf("($%d, $%d, $%d)", argID, argID+1, argID+2)
		args[argID-1] = match.UserEmail1
		args[argID] = match.UserEmail2
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

func (r *MatchRepository) GetMatches(email string) ([]models.Match, error) {
	var matches []models.Match
	query := `
		SELECT email_user1, email_user2, compatibility, like_user1, like_user2
		FROM matches JOIN users ON email = email_user1 OR email = email_user2
		WHERE email = $1;
	`

	rows, err := r.db.Query(query, email)
	if err != nil {
		return nil, fmt.Errorf("error getting matches: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var match models.Match
		if err := rows.Scan(&match.UserEmail1, &match.UserEmail2, &match.Compatibility, &match.LikeUser1, &match.LikeUser2); err != nil {
			return nil, fmt.Errorf("error scanning match row: %w", err)
		}
		matches = append(matches, match)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating match rows: %w", err)
	}

	log.Debug().Str("email", email).Msg("Matches retrieved successfully")
	log.Debug().Int("matches", len(matches)).Msg("Number of matches retrieved")

	return matches, nil
}

func (r *MatchRepository) SetLike(emailMain, emailMatch string, valueLike bool) error {
	var match models.Match

	queryGetMatch := `
		SELECT email_user1, email_user2, compatibility
		FROM matches
		WHERE (email_user1 = $1 AND email_user2 = $2) OR (email_user1 = $2 AND email_user2 = $1);
	`
	err := r.db.QueryRow(queryGetMatch, emailMain, emailMatch).Scan(&match.UserEmail1, &match.UserEmail2, &match.Compatibility)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("match not found between %s and %s", emailMain, emailMatch)
		}
		return fmt.Errorf("error getting match: %w", err)
	}

	log.Debug().Str("email_main", emailMain).Str("email_match", emailMatch).Msg("Match retrieved successfully")
	log.Debug().Msgf("Match: %+v", match)

	var query string
	var emailToUpdate string
	if match.UserEmail1 == emailMain {
		query = `
			UPDATE matches
			SET like_user1 = $1
			WHERE email_user1 = $2 AND email_user2 = $3;
		`
		emailToUpdate = "like_user1"
	} else if match.UserEmail2 == emailMain {
		query = `
			UPDATE matches
			SET like_user2 = $1
			WHERE email_user1 = $2 AND email_user2 = $3;
		`
		emailToUpdate = "like_user2"
	} else {
		return fmt.Errorf("email %s is not part of the match", emailMain)
	}

	result, err := r.db.Exec(query, valueLike, match.UserEmail1, match.UserEmail2)
	if err != nil {
		return fmt.Errorf("error setting like: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no match updated for %s", emailMain)
	}

	log.Info().Str("email_main", emailMain).Str("like_field", emailToUpdate).Bool("value", valueLike).Msg("Like updated successfully")

	return nil
}
