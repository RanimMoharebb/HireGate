# HireGate API Testing Script
# Run this script to test all API endpoints

$baseUrl = "http://localhost:5000"

Write-Host "[TESTING] Testing HireGate API Endpoints..." -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# Function to make HTTP requests
function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Uri,
        [string]$Body = $null,
        [string]$Description
    )

    Write-Host "`n[REQUEST] $Description" -ForegroundColor Magenta
    Write-Host "Method: $Method | URL: $Uri" -ForegroundColor Gray

    try {
        $params = @{
            Method = $Method
            Uri = $Uri
            Headers = @{ "Accept" = "application/json" }
        }

        if ($Body) {
            $params.Headers["Content-Type"] = "application/json"
            $params.Body = $Body
        }

        $response = Invoke-RestMethod @params
        Write-Host "SUCCESS: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "ERROR ($statusCode): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 1: Health Check
Test-Endpoint -Method GET -Uri "$baseUrl/" -Description "Health Check"

# Test 2: Get All Exams
Test-Endpoint -Method GET -Uri "$baseUrl/api/exam/" -Description "Get All Exams"

# Test 3: Get Exam by ID (may not exist yet)
Test-Endpoint -Method GET -Uri "$baseUrl/api/exam/1" -Description "Get Exam by ID (1)"

# Test 4: Create New Exam
$createExamBody = @'
{
  "positionTitle": "Software Engineer",
  "durationMinutes": 90,
  "windowStartTime": "2026-04-28T09:00:00Z",
  "windowEndTime": "2026-04-28T17:00:00Z",
  "questions": [
    {
      "id": 1,
      "text": "What is dependency injection?",
      "choices": [
        { "text": "A design pattern", "isCorrect": true },
        { "text": "A database", "isCorrect": false },
        { "text": "A programming language", "isCorrect": false },
        { "text": "A web framework", "isCorrect": false }
      ]
    }
  ]
}
'@

Test-Endpoint -Method POST -Uri "$baseUrl/api/exam/" -Body $createExamBody -Description "Create New Exam"

Write-Host "`n[SUCCESS] API Testing Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "[TIPS]:" -ForegroundColor Yellow
Write-Host "   • Make sure the API server is running (dotnet run in HireGate.API folder)"
Write-Host "   • Check database connection in appsettings.json"
Write-Host "   • Use VS Code REST Client extension for .http file testing"
Write-Host "   • Use Postman or similar tools for GUI testing"