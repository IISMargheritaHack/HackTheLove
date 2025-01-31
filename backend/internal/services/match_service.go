package services

import (
	"backend/config"
	"backend/internal/database/repository"
	"backend/internal/logger"
	"backend/internal/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"sort"
	"sync"
)

type SurveyService struct {
	Repo *repository.SurveyRepository
}

func NewSurveyService(db *sql.DB) *SurveyService {
	return &SurveyService{Repo: repository.NewSurveyRepository(db)}
}

type MatchService struct {
	Repo *repository.MatchRepository
}

func NewMatchService(db *sql.DB) *MatchService {
	return &MatchService{Repo: repository.NewMatchRepository(db)}
}

var log = logger.GetLogger()

func CalculateMatch(answersMatrix []models.Response, weights []float32) []models.Match {
	numUsers := len(answersMatrix)
	numQuestions := len(weights)

	var maxScore float32
	for _, w := range weights {
		maxScore += w
	}

	var matchMap sync.Map
	var wg sync.WaitGroup

	for indexUserMain := 0; indexUserMain < numUsers; indexUserMain++ {
		wg.Add(1)
		go func(userMain int) {
			defer wg.Done()
			localMatches := []models.Match{}

			for indexUserMatched := 0; indexUserMatched < numUsers; indexUserMatched++ {
				if userMain == indexUserMatched {
					continue
				}

				if answersMatrix[userMain].Sex == answersMatrix[indexUserMatched].Sex {
					continue
				}

				var matchScore float32
				for indexQuestion := 0; indexQuestion < numQuestions; indexQuestion++ {
					if answersMatrix[userMain].Response[indexQuestion] == answersMatrix[indexUserMatched].Response[indexQuestion] {
						matchScore += weights[indexQuestion]
					}
				}

				compatibility := (float64(matchScore) / float64(maxScore)) * 100

				email1, email2 := normalizeEmails(answersMatrix[userMain].Email, answersMatrix[indexUserMatched].Email)

				if compatibility > config.MIN_VALUE_COMPATIBILITY {
					localMatches = append(localMatches, models.Match{
						UserEmail:        email1,
						UserEmailMatched: email2,
						Compatibility:    compatibility,
					})
				}
			}

			for _, match := range localMatches {
				matchMap.Store(match.UserEmail+"-"+match.UserEmailMatched, match)
			}
		}(indexUserMain)
	}

	wg.Wait()

	var userMatches []models.Match
	matchMap.Range(func(_, value interface{}) bool {
		userMatches = append(userMatches, value.(models.Match))
		return true
	})

	sort.Slice(userMatches, func(a, b int) bool {
		return userMatches[a].Compatibility > userMatches[b].Compatibility
	})

	return userMatches
}

func normalizeEmails(email1, email2 string) (string, string) {
	if email1 < email2 {
		return email1, email2
	}
	return email2, email1
}

func GenerateUsers(numUsers int, numQuestions int) ([]models.Response, []float32) {
	answersMatrix := make([]models.Response, numUsers)
	choices := []string{"a", "b", "c", "d"}
	for i := 0; i < numUsers; i++ {
		answersMatrix[i].Email = fakeEmail(i)
		answersMatrix[i].Sex = rand.Intn(2) == 0
		answersMatrix[i].Response = make([]string, numQuestions)
		for j := 0; j < numQuestions; j++ {
			answersMatrix[i].Response[j] = choices[rand.Intn(len(choices))]
		}
	}

	weights := make([]float32, numQuestions)
	for i := 0; i < numQuestions; i++ {
		weights[i] = rand.Float32()
	}

	return answersMatrix, weights
}

func fakeEmail(index int) string {
	return fmt.Sprintf("user%d@example.com", index)
}

func (s *SurveyService) FetchResponseMatrix() ([]models.Response, error) {
	responses, err := s.Repo.GetAllUserSurveyResponse()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching responses")
		return nil, err
	}

	if len(responses) == 0 {
		log.Warn().Msg("No responses found")
		return nil, fmt.Errorf("no responses found")
	}

	return responses, nil
}

func (m *MatchService) SaveMatch(allMatches []models.Match) error {

	if err := m.Repo.InsertMatches(allMatches); err != nil {
		log.Error().Err(err).Msg("Error inserting matches")
		return err
	}

	return nil
}

func GetWeightQuestions() []float32 {
	var questions models.Questions
	err := json.Unmarshal(config.Questions, &questions)
	if err != nil {
		log.Error().Err(err).Msg("Error unmarshalling questions")
	}

	weights := make([]float32, len(questions.Questions))
	for i, q := range questions.Questions {
		weights[i] = q.Weight
	}

	return weights
}

func (m *MatchService) GetMatchAverage() (float64, error) {
	avg, err := m.Repo.GetMatchAverage()
	if err != nil {
		log.Error().Err(err).Msg("Error getting match average")
		return 0, err
	}

	if avg == 0 {
		log.Warn().Msg("No matches found in the database")
	}

	return avg, nil
}

func (s *SurveyService) StartMatching(m *MatchService) error {
	responses, err := s.FetchResponseMatrix()
	if err != nil {
		return err
	}
	weight := GetWeightQuestions()
	matches := CalculateMatch(responses, weight)
	err = m.SaveMatch(matches)
	if err != nil {
		return err
	}
	avg, err := m.GetMatchAverage()
	if err != nil {
		return err
	}

	log.Info().Msg("Matching process finished")

	log.Info().Msgf("Number of users: %d", len(responses))
	log.Info().Msgf("Number of matches: %d", len(matches))
	log.Info().Msgf("Average compatibility: %f", avg)

	return nil
}
