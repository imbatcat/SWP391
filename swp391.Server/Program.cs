using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using PetHealthcare.Server.Core.Helpers;
using Newtonsoft.Json;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Repositories;
using PetHealthcare.Server.Repositories.DbContext;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.BackgroundServices;
using PetHealthcare.Server.Services.Interfaces;
using JsonReader = PetHealthcare.Server.Core.Helpers.JsonReader;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var config = builder.Configuration;


// Add services to the container.
#region DBcontext
builder.Services.AddDbContext<PetHealthcareDbContext>(
option => option.UseSqlServer(JsonReader.readJson("Connection:sql-app-connection")));
builder.Services.AddDbContext<ApplicationDbContext>(
option => option.UseSqlServer(JsonReader.readJson("Connection:sql-auth-connection")));
#endregion


#region Repositories
builder.Services.AddScoped<IServiceOrderRepository, ServiceOrderRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ICageRepository, CageRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IPetRepository, PetRepository>();
builder.Services.AddScoped<ITimeslotRepository, TimeslotRepository>();
builder.Services.AddScoped<IMedicalRecordRepository, MedicalRecordRepository>();
builder.Services.AddScoped<IAdmissionRecordRepository, AdmissionRecordRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IBookingPaymentRepository, BookingPaymentRepository>();
builder.Services.AddScoped<IServiceOrderDetailRepository, ServiceOrderDetailRepository>();
#endregion

#region Services
// Application services
builder.Services.AddScoped<IServiceOrderService, ServiceOrderService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IHealthService, HealthService>();
builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();
builder.Services.AddScoped<IPetService, PetService>();
builder.Services.AddScoped<ICageService, CageService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<ITimeSlotService, TimeslotService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IAdmissionRecordService, AdmissionRecordService>();
builder.Services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<IBookingPaymentService, BookingPaymentService>();
builder.Services.AddScoped<BookingPaymentService>();
builder.Services.AddScoped<IServiceOrderDetailService, ServiceOrderDetailService>();
// Auth services
builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
// Background services
builder.Services.AddHostedService<DischargeEmailReminderService>();
builder.Services.AddHostedService<CancelOverdueAppointmentService>();

#endregion

#region Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                      });
});
#endregion

#region Swagger
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    }
    );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen().AddSwaggerGenNewtonsoftSupport();
#endregion

#region Cookie config
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = false;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.Name = "AspNetLogin";
    options.ExpireTimeSpan = TimeSpan.FromDays(3650);
    options.SlidingExpiration = true;
});
#endregion

#region Identity
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>(
    options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.Configure<SecurityStampValidatorOptions>(options =>
{
    options.ValidationInterval = TimeSpan.Zero;
});

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    // this sets the lifespan for generated tokens like email and reset password
    options.TokenLifespan = TimeSpan.FromMinutes(30);
});
#endregion 



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(MyAllowSpecificOrigins);

app.UseRouting();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization();
//app.MapIdentityApi<ApplicationUser>();


app.Run();
