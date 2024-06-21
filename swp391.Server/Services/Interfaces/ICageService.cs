﻿using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services.Interfaces
{
    public interface ICageService
    {
        Task<IEnumerable<Cage>> GetAllCages();
        Task<Cage?> GetCageByCondition(Expression<Func<Cage, bool>> expression);
        Task CreateCage(CageDTO Cage);
        Task UpdateCage(int id, CageDTO Cage);
        void DeleteCage(Cage Cage);
    }
}
