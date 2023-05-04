﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Lab3BookAPI.Model;
using Lab3BookAPI.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace Lab3BookAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly IConfiguration _config;
        private readonly Validate _validate;

        public UsersController(BookContext context, IConfiguration config, Validate validate)
        {
            _context = context;
            _config = config;
            _validate = validate;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUser(int pageNumber = 0, int pageSize = 10)
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

    //    [HttpGet("secret")]
    //    public async Task<ActionResult> Secret()
    //{

    //    // Generate a random 256-bit key
    //    byte[] keyBytes = new byte[32];
    //    using (var rng = new RNGCryptoServiceProvider())
    //    {
    //        rng.GetBytes(keyBytes);
    //    }

    //    // Convert the key to a string
    //    string jwtSecret = Convert.ToBase64String(keyBytes);
    //    return Ok(jwtSecret);
    //}

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Register(UserDTO model)
        {
            // Check if username is already taken
            if (await _context.Users.AnyAsync(u => u.Name == model.Name))
            {
                return Conflict("Username is already taken.");
            }

            // Validate password
            //if (!IsPasswordValid(model.Password))
            //{
            //    return BadRequest("Password is not strong enough.");
            //}

            // Generate confirmation code
            string confirmationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            DateTime confirmationCodeExpiration = DateTime.UtcNow.AddMinutes(10);

            // Create user and user profile
            User user = new User
            {
                Name = model.Name,
                Password = HashPassword(model.Password),
                IsConfirmed = false,
                ConfirmationCode = confirmationCode,
                ConfirmationCodeExpiration = confirmationCodeExpiration, 
                UserProfile = new UserProfile
                {
                    Id = model.Id,
                    //Bio = model.Bio,
                    //Location = model.Location,
                    //Birthday = model.Birthday,
                    //Gender = model.Gender,
                    //MaritalStatus = model.MaritalStatus
                }
            };

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = HashPassword(user.Password)
            };

            // return CreatedAtAction(nameof(GetUser), new { id = userDTO.Id }, new { userDTO, confirmationCode });
            return Ok(new {confirmationCode });
        }

        // GET /api/register/confirm/{confirmationCode}
        [HttpGet("register/confirm/{confirmationCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> Confirm(string confirmationCode)
        {
            // Find user with confirmation code
            User user = await _context.Users.FirstOrDefaultAsync(u => u.ConfirmationCode == confirmationCode);
            if (user == null)
            {
                return NotFound("Confirmation code is invalid.");
            }

            // Check if confirmation code is expired
            if (DateTime.UtcNow > user.ConfirmationCodeExpiration)
            {
                return BadRequest("Confirmation code has expired.");
            }

            // Confirm user account
            user.IsConfirmed = true;
            user.ConfirmationCode = null;
            user.ConfirmationCodeExpiration = null;
            await _context.SaveChangesAsync();

            return Ok("Account confirmed.");
        }


        [HttpGet("user-profile/{id}")]
        public async Task<ActionResult<UserProfileStatisticsDTO>> GetUserProfileWithStatistics(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userProfileDTO = new UserProfileStatisticsDTO
            {
                Id = id,
                Name = user.Name,
                Bio = user.UserProfile.Bio,
                Location = user.UserProfile.Location,
                Birthday = user.UserProfile.Birthday,
                Gender = user.UserProfile.Gender,
                MaritalStatus = user.UserProfile.MaritalStatus,
                NrOfBooks = await _context.Books.CountAsync(b => b.UserId == id),
                NrOfAuthors = await _context.Authors.CountAsync(a => a.UserId == id),
                NrOfGenres = await _context.Genres.CountAsync(g => g.UserId == id)
            };

            return Ok(userProfileDTO);
        }

        // POST /api/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserDTO model)
        {
            // Find user by username and password
            User user = await _context.Users
                .FirstOrDefaultAsync(u => u.Name == model.Name && u.Password == HashPassword(model.Password));

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Check if user account is confirmed
            if ((bool)!user.IsConfirmed)
            {
                return Unauthorized("Account is not confirmed.");
            }

            // Generate JWT token
            string token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        // Helper method to generate a confirmation code
        private string GenerateConfirmationCode()
        {
            string confirmationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            DateTime confirmationCodeExpiration = DateTime.UtcNow.AddMinutes(10);
            return confirmationCode;
        }



        // Helper method to generate a JWT token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Name)
             };

            // Get JWT secret from configuration
            string jwtSecret = _config["Jwt:Secret"];
            if (string.IsNullOrEmpty(jwtSecret))
            {
                throw new InvalidOperationException("JWT secret is not configured.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Helper method to check if a password is strong enough
        //private bool IsPasswordValid(string password)
        //{
        //    // Implement your own validation rules here
        //    return password.Length >= 8 && password.Any(char.IsUpper) && password.Any(char.IsDigit);
        //}

        public static string HashPassword(string password)
        {
            // Convert password to bytes
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            // Create SHA-256 hash object
            using (SHA256 sha256 = SHA256.Create())
            {
                // Compute hash value of password bytes
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                // Convert hash bytes to hexadecimal string
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }

        private static UserDTO UserToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
            };
        }
    }
}
