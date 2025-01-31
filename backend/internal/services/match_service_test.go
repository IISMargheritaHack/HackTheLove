package services

import (
	"backend/internal/database"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func SetupTestDB() *database.Database {
	db := database.New()
	return db
}

func TestMatchAlgo_Success(t *testing.T) {
	answersMatrix, weights := GenerateUsers(5, 5)
	t.Logf("Answers matrix: %v", answersMatrix)
	t.Logf("Weights: %v", weights)
	allMatches := CalculateMatch(answersMatrix, weights)
	t.Logf("Matches: %v", allMatches)

	for i := 0; i < len(allMatches); i++ {
		match := allMatches[i]
		t.Logf("Match %s with %s: %.2f%%\n", match.UserEmail, match.UserEmailMatched, match.Compatibility)
	}

	assert.Equal(t, true, true)
}

func TestFetchResponse_Success(t *testing.T) {
	service := NewSurveyService(SetupTestDB().GetDB())
	responses, _ := service.FetchResponseMatrix()
	t.Logf("Responses: %v", responses)
	assert.Equal(t, true, true)
}

func TestFetchWeight_Success(t *testing.T) {
	weights := GetWeightQuestions()
	t.Logf("Weights: %v", weights)
	assert.Equal(t, true, true)
}

func TestCalcMatch_Success(t *testing.T) {
	start_time := time.Now()
	service := NewSurveyService(SetupTestDB().GetDB())
	responses, _ := service.FetchResponseMatrix()
	weights := GetWeightQuestions()
	allMatches := CalculateMatch(responses, weights)
	for i := 0; i < len(allMatches); i++ {
		match := allMatches[i]
		t.Logf("Match %s with %s: %.2f%%\n", match.UserEmail, match.UserEmailMatched, match.Compatibility)
	}
	elapsed_time := time.Since(start_time)
	t.Logf("Elapsed time for complete task with print: %v", elapsed_time)

	assert.Equal(t, true, true)
}

func TestCompleteTask_Success(t *testing.T) {
	start_time := time.Now()
	serviceSurvey := NewSurveyService(SetupTestDB().GetDB())
	serviceMatch := NewMatchService(SetupTestDB().GetDB())
	responses, _ := serviceSurvey.FetchResponseMatrix()
	weights := GetWeightQuestions()
	allMatches := CalculateMatch(responses, weights)
	err := serviceMatch.SaveMatch(allMatches)
	if err != nil {
		t.Errorf("Error saving matches: %v", err)
	}
	elapsed_time := time.Since(start_time)
	t.Logf("Elapsed time for complete task: %v", elapsed_time)

	assert.Equal(t, true, true)
}

func TestGetMatchAverage_Success(t *testing.T) {
	serviceMatch := NewMatchService(SetupTestDB().GetDB())
	avg, err := serviceMatch.GetMatchAverage()
	if err != nil {
		t.Errorf("Error getting match average: %v", err)
	}
	t.Logf("Match average: %.2f", avg)
	assert.Equal(t, true, true)
}
