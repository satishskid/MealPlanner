# NutreeAI - Multi-Tenant B2B Nutrition Analysis Platform

## 🌟 Overview

NutreeAI is a comprehensive multi-tenant B2B SaaS platform that provides AI-powered nutrition analysis with professional nutritionist oversight. The platform enables healthcare providers, educational institutions, and corporate wellness programs to offer white-label nutrition services to their patients and members.

## 🏗️ Architecture

### Multi-Tenant B2B Platform
- **White-label patient portals** with custom branding
- **Flexible nutritionist assignment models** (in-house, NutreeAI-provided, hybrid)
- **Organization management** with configurable settings
- **Professional PDF report generation** with digital signatures
- **Enterprise-grade security** with data isolation

### Key Components
- **Patient Portal** - Flexible food input with OR/AND operators
- **Nutritionist Dashboard** - Enhanced review interface with editable AI recommendations
- **Admin Management** - Super-admin controls for platform oversight
- **Organization Management** - Multi-tenant organization registration and configuration
- **White-Label System** - Customizable branding and subdomain support

## 🚀 Features

### For Patients
- ✅ **Flexible Food Input** - Simple mode and advanced mode with logical operators
- ✅ **Cultural Intelligence** - Respects diverse food traditions and preferences
- ✅ **Real-time Status Tracking** - Monitor analysis progress from submission to completion
- ✅ **Professional Reports** - AI analysis enhanced by certified nutritionists
- ✅ **Mobile Responsive** - Works seamlessly across all devices

### For Nutritionists
- ✅ **Enhanced Review Interface** - Complete AI analysis display with editable recommendations
- ✅ **Case Management** - Organized dashboard with pending and completed cases
- ✅ **Professional Tools** - Modify AI recommendations with professional expertise
- ✅ **Assignment Intelligence** - Smart case routing based on specialization and workload
- ✅ **Digital Signatures** - Professional validation with credentials and timestamps

### For Organizations
- ✅ **White-Label Portals** - Custom branding with organization logos and colors
- ✅ **Flexible Assignment Models** - Choose between in-house, NutreeAI, or hybrid nutritionists
- ✅ **Bulk Processing** - CSV uploads for schools and corporate wellness programs
- ✅ **Analytics Dashboard** - Usage metrics, performance tracking, and billing insights
- ✅ **Professional Reports** - Healthcare-grade PDF reports with organization branding

### For Administrators
- ✅ **Multi-Tenant Management** - Oversee all organizations from central dashboard
- ✅ **Intelligent Assignment** - AI-powered nutritionist matching with manual override
- ✅ **System Analytics** - Platform-wide performance metrics and revenue tracking
- ✅ **Quality Control** - Cross-organization oversight and compliance monitoring
- ✅ **Billing Management** - Multiple pricing models and usage tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Netlify Identity** for authentication

### AI & Analytics
- **Google Gemini AI** for nutrition analysis
- **Custom AI prompts** for cultural and dietary intelligence
- **Intelligent assignment algorithms** for nutritionist matching

### PDF Generation
- **jsPDF** for professional report generation
- **Custom templates** with organization branding
- **Digital signatures** and healthcare compliance

### Deployment
- **Netlify** for hosting and CI/CD
- **Git-based deployment** with automatic builds
- **Environment variable management**

## 📁 Project Structure

```
nutreeAI/
├── components/
│   ├── AdminDashboard.tsx           # Super-admin platform management
│   ├── AdminLogin.tsx               # Secure admin authentication with MFA
│   ├── AssignmentManagement.tsx     # Intelligent case assignment system
│   ├── FlexibleMealInput.tsx        # Advanced food input with OR/AND operators
│   ├── LandingPage.tsx              # Main landing page with B2B features
│   ├── NutritionistDashboard.tsx    # Enhanced nutritionist review interface
│   ├── NutritionistManagement.tsx   # Nutritionist profile and capacity management
│   ├── OrganizationManagement.tsx   # Multi-tenant organization oversight
│   ├── OrganizationRegistration.tsx # 3-step organization onboarding wizard
│   ├── PatientStatusTracker.tsx     # Real-time case status monitoring
│   ├── ProfessionalReport.tsx       # AI + nutritionist combined reports
│   └── WhiteLabelPortal.tsx         # Customizable organization-branded portals
├── services/
│   ├── geminiService.ts             # AI nutrition analysis with cultural intelligence
│   └── pdfReportService.ts          # Professional PDF generation with branding
├── types.ts                         # Comprehensive TypeScript definitions
├── App.tsx                          # Main application with multi-tenant routing
└── docs/                            # Documentation and guides
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Google Gemini API key
- Netlify account for deployment

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/nutreeai.git
cd nutreeai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Google Gemini API key to .env

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_NETLIFY_SITE_URL=your_netlify_site_url
```

## 🌐 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Enable Netlify Identity for authentication

### Custom Domain Setup
- Configure DNS for main domain (nutreeai.com)
- Set up wildcard subdomain (*.nutreeai.com) for organization portals
- Enable SSL certificates for all domains

## 👥 User Roles & Access

### Patient
- Submit food logs through organization-branded portals
- Track analysis status in real-time
- Receive professional reports with nutritionist validation

### Nutritionist
- Review and enhance AI-generated nutrition analysis
- Manage case assignments and workload
- Provide professional validation with digital signatures

### Organization Admin
- Configure organization settings and branding
- Manage in-house nutritionists (if applicable)
- View organization-specific analytics and billing

### Super Admin
- Oversee all organizations and nutritionists
- Manage platform-wide settings and assignments
- Monitor system performance and revenue metrics

## 🔐 Security & Compliance

### Data Protection
- **Multi-tenant data isolation** - Secure separation between organizations
- **Role-based access control** - Granular permissions for each user type
- **Audit logging** - Complete action tracking for compliance requirements
- **HIPAA/GDPR compliance** - Healthcare data protection standards

### Authentication
- **Multi-factor authentication** for admin access
- **Organization-specific credentials** for nutritionists
- **Secure session management** with automatic timeouts
- **Professional access codes** for nutritionist verification

## 📊 Business Models

### Pricing Options
- **Per-Case Model** - $25 per nutrition analysis
- **Monthly Subscription** - Fixed fee for unlimited cases
- **Annual Contracts** - Volume discounts for large organizations
- **Custom Enterprise** - Tailored pricing for specific requirements

### Target Markets
- **Healthcare Providers** - Clinics, hospitals, wellness centers
- **Educational Institutions** - Schools, colleges, universities
- **Corporate Wellness** - Employee health programs
- **Telehealth Providers** - Remote healthcare services
- **Research Organizations** - Academic and clinical studies

## 🧪 Testing

### Demo Access
Demo credentials are available for authorized developers and stakeholders. Please contact the development team for access to:
- Super Admin dashboard
- Manager interface
- Nutritionist review system

**Note**: Production system will use secure authentication with organization-specific credentials.

## 📈 Analytics & Monitoring

### Platform Metrics
- **Total organizations** and active users
- **Case processing volume** and completion rates
- **Nutritionist utilization** and performance
- **Revenue tracking** and billing analytics
- **System performance** and uptime monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**NutreeAI** - Transforming nutrition analysis through AI and professional expertise
🌱 *Making healthy eating accessible, culturally intelligent, and professionally validated*
