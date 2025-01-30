package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"io"
)

type PhotoRepository struct {
	db *sql.DB
}

func NewPhotoRepository(db *sql.DB) *PhotoRepository {
	return &PhotoRepository{db: db}
}

func (r *PhotoRepository) GetPhoto(email string) ([][]byte, error) {
	var images [][]byte

	query := `
		SELECT lo_get(lo_oid)
		FROM images
		WHERE email_user = $1
		ORDER BY uploaded_at DESC;
	`

	rows, err := r.db.Query(query, email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching images")
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var imgData []byte
		if err := rows.Scan(&imgData); err != nil {
			log.Error().Err(err).Msg("Failed to read image data from database")
			return nil, err
		}
		images = append(images, imgData)
	}

	if len(images) == 0 {
		log.Warn().Str("email", email).Msg("No images found")
		return nil, sql.ErrNoRows
	}

	log.Debug().Str("email", email).Int("count", len(images)).Msg("Images retrieved successfully")
	return images, nil
}

func (r *PhotoRepository) AddPhoto(email string, imageFile io.Reader) error {
	tx, err := r.db.Begin()
	if err != nil {
		log.Error().Err(err).Msg("Failed to start transaction")
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	var loOID uint32
	err = tx.QueryRow("SELECT lo_create(0)").Scan(&loOID)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create Large Object")
		return fmt.Errorf("failed to create Large Object: %w", err)
	}

	var loFd int
	err = tx.QueryRow("SELECT lo_open($1, $2)", loOID, 0x20000).Scan(&loFd) // 0x20000 = modalità scrittura
	if err != nil {
		log.Error().Err(err).Msg("Failed to open Large Object")
		return fmt.Errorf("failed to open Large Object: %w", err)
	}

	buf := make([]byte, 4096)
	for {
		n, readErr := imageFile.Read(buf)
		if n > 0 {
			_, errWrite := tx.Exec("SELECT lowrite($1, $2)", loFd, buf[:n])
			if errWrite != nil {
				log.Error().Err(errWrite).Msg("Failed to write to Large Object")
				return fmt.Errorf("failed to write to Large Object: %w", errWrite)
			}
		}
		if readErr == io.EOF {
			break
		}
		if readErr != nil {
			log.Error().Err(readErr).Msg("Failed to read image file")
			return fmt.Errorf("failed to read image file: %w", readErr)
		}
	}

	_, err = tx.Exec("SELECT lo_close($1)", loFd)
	if err != nil {
		log.Error().Err(err).Msg("Failed to close Large Object")
		return fmt.Errorf("failed to close Large Object: %w", err)
	}

	_, err = tx.Exec(`
        INSERT INTO images (email_user, lo_oid)
        VALUES ($1, $2)`, email, loOID)
	if err != nil {
		log.Error().Err(err).Msg("Failed to insert image record")
		return fmt.Errorf("failed to insert image record: %w", err)
	}

	if err := tx.Commit(); err != nil {
		log.Error().Err(err).Msg("Failed to commit transaction")
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Info().Str("email", email).Uint32("loOID", loOID).Msg("Image successfully uploaded")
	return nil
}

func (r *PhotoRepository) GetImageIDByEmail(email string) (int, error) {
	var imageID int
	query := `
		SELECT id_image
		FROM images
		WHERE email_user = $1
		ORDER BY uploaded_at DESC
		LIMIT 1;
	`
	err := r.db.QueryRow(query, email).Scan(&imageID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn().Str("email", email).Msg("No images found")
			return 0, nil
		}
		log.Error().Err(err).Msg("Failed to retrieve image ID")
		return 0, err
	}

	log.Debug().Int("imageID", imageID).Str("email", email).Msg("Image ID retrieved")
	return imageID, nil
}

func (r *PhotoRepository) GetNumberPhoto(email string) (int, error) {
	var photoNumber int

	query := `
		SELECT COALESCE(SUM(lo_oid::int), 0)
		FROM images
		WHERE email_user = $1;
	`

	err := r.db.QueryRow(query, email).Scan(&photoNumber)
	if err != nil {
		log.Error().Err(err).Msg("Failed to retrieve image size")
		return 0, err
	}

	return photoNumber, nil
}
