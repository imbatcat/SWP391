﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace PetHealthcareSystem.Migrations
{
    [DbContext(typeof(PetHealthcareDbContext))]
    partial class PetHealthcareDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("PetHealthcareSystem.Mode.BookingPayment", b =>
                {
                    b.Property<string>("PaymentId")
                        .HasColumnType("char(11)");

                    b.Property<string>("AppointmentId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("PaymentDate")
                        .HasColumnType("date");

                    b.Property<string>("PaymentMethod")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.HasKey("PaymentId");

                    b.HasIndex("AppointmentId");

                    b.ToTable("BookingPayments");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Account", b =>
                {
                    b.Property<string>("AccountId")
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("DateOfBirth")
                        .HasColumnType("date");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<bool>("IsDisabled")
                        .HasColumnType("bit");

                    b.Property<bool>("IsMale")
                        .HasColumnType("bit");

                    b.Property<DateOnly>("JoinDate")
                        .HasColumnType("date");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("AccountId");

                    b.HasIndex("RoleId");

                    b.ToTable("Accounts");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Account");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.AdmissionRecord", b =>
                {
                    b.Property<string>("AdmissionId")
                        .HasMaxLength(10)
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("AdmissionDate")
                        .HasColumnType("date");

                    b.Property<int>("CageId")
                        .HasColumnType("int");

                    b.Property<DateOnly?>("DischargeDate")
                        .HasColumnType("date");

                    b.Property<bool>("IsDischarged")
                        .HasColumnType("bit");

                    b.Property<string>("MedicalRecordId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<string>("PetCurrentCondition")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PetId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<string>("VeterinarianAccountId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.HasKey("AdmissionId");

                    b.HasIndex("CageId");

                    b.HasIndex("MedicalRecordId");

                    b.HasIndex("PetId");

                    b.HasIndex("VeterinarianAccountId");

                    b.ToTable("AdmissionRecords");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Appointment", b =>
                {
                    b.Property<string>("AppointmentId")
                        .HasColumnType("char(11)");

                    b.Property<string>("AccountId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("AppointmentDate")
                        .HasColumnType("date");

                    b.Property<string>("AppointmentNotes")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("AppointmentType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<double>("BookingPrice")
                        .HasColumnType("float");

                    b.Property<string>("PetId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<int>("TimeSlotId")
                        .HasColumnType("int");

                    b.Property<string>("VeterinarianAccountId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.HasKey("AppointmentId");

                    b.HasIndex("AccountId");

                    b.HasIndex("PetId");

                    b.HasIndex("TimeSlotId");

                    b.HasIndex("VeterinarianAccountId");

                    b.ToTable("Appointments");

                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Cage", b =>
                {
                    b.Property<int>("CageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CageId"));

                    b.Property<int>("CageNumber")
                        .HasColumnType("int");

                    b.Property<bool>("IsOccupied")
                        .HasColumnType("bit");

                    b.HasKey("CageId");

                    b.ToTable("Cages");

                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Feedback", b =>
                {
                    b.Property<int>("FeedbackId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FeedbackId"));

                    b.Property<string>("AccountId")
                        .HasColumnType("char(11)");

                    b.Property<string>("FeedbackDetails")
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<int>("Ratings")
                        .HasColumnType("int");

                    b.HasKey("FeedbackId");

                    b.HasIndex("AccountId");

                    b.ToTable("Feedbacks");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.MedicalRecord", b =>
                {
                    b.Property<string>("MedicalRecordId")
                        .HasColumnType("char(11)");

                    b.Property<string>("AdditionalNotes")
                        .HasMaxLength(300)
                        .HasColumnType("nvarchar(300)");

                    b.Property<string>("Allergies")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("AppointmentId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("DateCreated")
                        .HasColumnType("date");

                    b.Property<string>("Diagnosis")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("DrugPrescriptions")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<DateOnly?>("FollowUpAppointmentDate")
                        .HasColumnType("date");

                    b.Property<string>("FollowUpAppointmentNotes")
                        .HasMaxLength(300)
                        .HasColumnType("nvarchar(300)");

                    b.Property<string>("PetId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<int>("PetWeight")
                        .HasColumnType("int");

                    b.Property<string>("Symptoms")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.HasKey("MedicalRecordId");

                    b.HasIndex("AppointmentId");

                    b.HasIndex("PetId");

                    b.ToTable("MedicalRecords");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Pet", b =>
                {
                    b.Property<string>("PetId")
                        .HasColumnType("char(11)");

                    b.Property<string>("AccountId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<string>("Description")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("ImgUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsCat")
                        .HasColumnType("bit");

                    b.Property<bool>("IsDisabled")
                        .HasColumnType("bit");

                    b.Property<bool>("IsMale")
                        .HasColumnType("bit");

                    b.Property<int>("PetAge")
                        .HasColumnType("int");

                    b.Property<string>("PetBreed")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("VaccinationHistory")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.HasKey("PetId");

                    b.HasIndex("AccountId");

                    b.ToTable("Pets");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Service", b =>
                {
                    b.Property<int>("ServiceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ServiceId"));

                    b.Property<string>("ServiceName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<double>("ServicePrice")
                        .HasColumnType("float");

                    b.HasKey("ServiceId");

                    b.ToTable("Services");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.ServiceOrder", b =>
                {
                    b.Property<string>("ServiceOrderId")
                        .HasColumnType("char(11)");

                    b.Property<string>("MedicalRecordId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("OrderDate")
                        .HasColumnType("date");

                    b.Property<string>("OrderStatus")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.HasKey("ServiceOrderId");

                    b.HasIndex("MedicalRecordId");

                    b.ToTable("ServiceOrders");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.ServicePayment", b =>
                {
                    b.Property<string>("ServicePaymentId")
                        .HasColumnType("char(11)");

                    b.Property<DateOnly>("PaymentDate")
                        .HasColumnType("date");

                    b.Property<string>("PaymentMethod")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("ServiceOrderId")
                        .IsRequired()
                        .HasColumnType("char(11)");

                    b.Property<double>("ServicePrice")
                        .HasColumnType("float");

                    b.HasKey("ServicePaymentId");

                    b.HasIndex("ServiceOrderId")
                        .IsUnique();

                    b.ToTable("ServicePayments");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.TimeSlot", b =>
                {
                    b.Property<int>("TimeSlotId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TimeSlotId"));

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("time");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("time");

                    b.HasKey("TimeSlotId");

                    b.ToTable("TimeSlots");
                });

            modelBuilder.Entity("ServiceServiceOrder", b =>
                {
                    b.Property<string>("ServiceOrdersServiceOrderId")
                        .HasColumnType("char(11)");

                    b.Property<int>("ServicesServiceId")
                        .HasColumnType("int");

                    b.HasKey("ServiceOrdersServiceOrderId", "ServicesServiceId");

                    b.HasIndex("ServicesServiceId");

                    b.ToTable("ServiceServiceOrder");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Veterinarian", b =>
                {
                    b.HasBaseType("PetHealthcareSystem.Models.Account");

                    b.Property<string>("Department")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<int>("Experience")
                        .HasColumnType("int");

                    b.Property<string>("ImgUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasDiscriminator().HasValue("Veterinarian");
                });

            modelBuilder.Entity("PetHealthcareSystem.Mode.BookingPayment", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Appointment", "Appointment")
                        .WithMany("BookingPayments")
                        .HasForeignKey("AppointmentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Appointment");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Account", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Role", "AccountRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AccountRole");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.AdmissionRecord", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Cage", "Cage")
                        .WithMany("AdmissionRecords")
                        .HasForeignKey("CageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.MedicalRecord", "MedicalRecord")
                        .WithMany("AdmissionRecords")
                        .HasForeignKey("MedicalRecordId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Pet", "Pet")
                        .WithMany("AdmissionRecords")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Veterinarian", "Veterinarian")
                        .WithMany()
                        .HasForeignKey("VeterinarianAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Cage");

                    b.Navigation("MedicalRecord");

                    b.Navigation("Pet");

                    b.Navigation("Veterinarian");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Appointment", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Account", "Account")
                        .WithMany("Appointments")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.TimeSlot", "TimeSlot")
                        .WithMany()
                        .HasForeignKey("TimeSlotId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Veterinarian", "Veterinarian")
                        .WithMany()
                        .HasForeignKey("VeterinarianAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("Pet");

                    b.Navigation("TimeSlot");

                    b.Navigation("Veterinarian");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Feedback", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Account", "Account")
                        .WithMany("Feedbacks")
                        .HasForeignKey("AccountId");

                    b.Navigation("Account");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.MedicalRecord", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Appointment", "Appointment")
                        .WithMany()
                        .HasForeignKey("AppointmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Appointment");

                    b.Navigation("Pet");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Pet", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.Account", "Account")
                        .WithMany("Pets")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Account");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.ServiceOrder", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.MedicalRecord", "MedicalRecord")
                        .WithMany("ServiceOrders")
                        .HasForeignKey("MedicalRecordId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MedicalRecord");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.ServicePayment", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.ServiceOrder", "ServiceOrder")
                        .WithOne("ServicePayment")
                        .HasForeignKey("PetHealthcareSystem.Models.ServicePayment", "ServiceOrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ServiceOrder");
                });

            modelBuilder.Entity("ServiceServiceOrder", b =>
                {
                    b.HasOne("PetHealthcareSystem.Models.ServiceOrder", null)
                        .WithMany()
                        .HasForeignKey("ServiceOrdersServiceOrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetHealthcareSystem.Models.Service", null)
                        .WithMany()
                        .HasForeignKey("ServicesServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Account", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("Feedbacks");

                    b.Navigation("Pets");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Appointment", b =>
                {
                    b.Navigation("BookingPayments");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Cage", b =>
                {
                    b.Navigation("AdmissionRecords");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.MedicalRecord", b =>
                {
                    b.Navigation("AdmissionRecords");

                    b.Navigation("ServiceOrders");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.Pet", b =>
                {
                    b.Navigation("AdmissionRecords");
                });

            modelBuilder.Entity("PetHealthcareSystem.Models.ServiceOrder", b =>
                {
                    b.Navigation("ServicePayment")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
