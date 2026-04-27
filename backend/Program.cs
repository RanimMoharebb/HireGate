using Microsoft.EntityFrameworkCore;
using backend.HireGate.Data.Context;
using backend.HireGate.Repository.Interfaces;
using backend.HireGate.Repository.Implementations;
using backend.HireGate.Service.Interfaces;
using backend.HireGate.Service.Implementations;
using backend.HireGate.API.Endpoints;
using FluentValidation;
using FluentValidation.AspNetCore;
using backend.HireGate.Service.Validators;
var builder = WebApplication.CreateBuilder(args);

// --------------------
// DB
// --------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("DefaultConnection is missing in appsettings.json");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString));

// --------------------
// Services
// --------------------
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<IExamRepository, ExamRepository>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateExamDtoValidator>();

var app = builder.Build();

app.UseHttpsRedirection();

// --------------------
// Minimal API endpoints
// --------------------
app.MapExamEndpoints();

app.Run();