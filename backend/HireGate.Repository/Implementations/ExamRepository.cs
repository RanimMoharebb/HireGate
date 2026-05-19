using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{
    public class ExamRepository : IExamRepository
    {
        private readonly AppDbContext _context;

        public ExamRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Exam> Exams, int TotalCount)> GetAllExamsAsync(int pageNumber, int pageSize, string? search = null)
        {
            IQueryable<Exam> query = _context.Exams.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(e => e.PositionTitle != null && e.PositionTitle.ToLower().Contains(term));
            }

            var totalCount = await query.CountAsync();

            var exams = await query
                .OrderByDescending(e => e.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (exams, totalCount);
        }

        public async Task<Exam?> GetExamByIdAsync(int id)
        {
            return await _context.Exams
                .AsNoTracking()
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Choices)
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Topic)
                .AsSplitQuery()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Exam?> GetExamByIdForUpdateAsync(int id)
        {
            return await _context.Exams
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Choices)
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Topic)
                .AsSplitQuery()
                .FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<bool> DeleteExamByIdAsync(int id)
        {
            var deleted = await _context.Exams
                .Where(e => e.Id == id)
                .ExecuteDeleteAsync();
            return deleted > 0;
        }

        public void CreateExam(Exam exam) => _context.Exams.Add(exam);
        public void UpdateExam(Exam exam) => _context.Exams.Update(exam);
        public void DeleteExam(Exam exam) => _context.Exams.Remove(exam);

        public async Task SaveAsync() => await _context.SaveChangesAsync();
    }
}