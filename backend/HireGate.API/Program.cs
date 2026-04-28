using Microsoft.EntityFrameworkCore;
using HireGate.Data.Context;
using HireGate.Repository.Interfaces;
using HireGate.Repository.Implementations;
using HireGate.Service.Interfaces;
using HireGate.Service.Implementations;
using HireGate.API.Endpoints;
using FluentValidation;
using FluentValidation.AspNetCore;
using HireGate.Service.Validators;

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
builder.Services.AddScoped<ITopicRepository, TopicRepository>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IChoiceRepository, ChoiceRepository>();
builder.Services.AddScoped<IChoiceService, ChoiceService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateExamDtoValidator>();

var app = builder.Build();

app.UseHttpsRedirection();

// --------------------
// Minimal API endpoints
// --------------------
app.MapExamEndpoints();
app.MapTopicEndpoints(app.Services);
app.MapQuestionEndpoints(app.Services);
app.MapChoiceEndpoints(app.Services);

app.Run();
