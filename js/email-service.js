// Email Notification Service
// Sends emails for donor registration and emergency requests

class EmailService {
    constructor() {
        this.apiClient = typeof apiClient !== 'undefined' ? apiClient : null;
    }

    // Send registration confirmation email
    async sendRegistrationEmail(donorData) {
        const subject = `Blood Donation Registration Confirmation - ${donorData.name}`;
        const body = this.getRegistrationEmailBody(donorData);
        
        // For now, we'll use mailto link
        // In production, integrate with email service (SendGrid, Mailgun, etc.)
        const mailtoLink = `mailto:${donorData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Log for debugging
        console.log('Registration Email:', { to: donorData.email, subject, body });
        
        // In production, call your email API
        // await this.sendEmailViaAPI(donorData.email, subject, body);
        
        return { success: true, message: 'Registration confirmation email prepared' };
    }

    // Send emergency request notification
    async sendEmergencyRequestEmail(requestData, matchingDonors = []) {
        const subject = `Emergency Blood Request - ${requestData.bloodType} Needed`;
        const body = this.getEmergencyRequestEmailBody(requestData, matchingDonors);
        
        // Send to admin/hospital
        console.log('Emergency Request Email:', { subject, body, matchingDonors: matchingDonors.length });
        
        // Notify matching donors
        if (matchingDonors.length > 0) {
            for (const donor of matchingDonors) {
                await this.notifyDonor(donor, requestData);
            }
        }
        
        return { success: true, message: 'Emergency request notifications sent' };
    }

    // Notify a donor about emergency request
    async notifyDonor(donor, requestData) {
        const subject = `Urgent: Blood Donation Request - ${requestData.bloodType}`;
        const body = this.getDonorNotificationEmailBody(donor, requestData);
        
        console.log('Donor Notification Email:', { 
            to: donor.email || donor.Email, 
            subject, 
            body 
        });
        
        // In production, send actual email
        // await this.sendEmailViaAPI(donor.email, subject, body);
        
        return { success: true };
    }

    // Registration email body
    getRegistrationEmailBody(donorData) {
        const lang = localStorage.getItem('language') || 'en';
        
        if (lang === 'ta') {
            return `வணக்கம் ${donorData.name},

உங்கள் இரத்த தானம் பதிவு வெற்றிகரமாக முடிக்கப்பட்டது!

பதிவு விவரங்கள்:
• பெயர்: ${donorData.name}
• இரத்த வகை: ${donorData.bloodType}
• மாவட்டம்: ${donorData.district}
• ஒன்றியம்: ${donorData.union}
• தொடர்பு: ${donorData.contact}

நீங்கள் இப்போது எங்கள் இரத்த தானம் செய்பவர்கள் சமூகத்தின் ஒரு பகுதியாகிவிட்டீர்கள். உங்கள் தானம் வாழ்க்கைகளை காப்பாற்ற உதவும்.

நன்றி,
AI-Based Intelligent Blood Donation Platform`;
        }
        
        return `Hello ${donorData.name},

Your blood donation registration has been successfully completed!

Registration Details:
• Name: ${donorData.name}
• Blood Type: ${donorData.bloodType}
• District: ${donorData.district}
• Union: ${donorData.union}
• Contact: ${donorData.contact}

You are now part of our blood donor community. Your donation will help save lives.

Thank you,
AI-Based Intelligent Blood Donation Platform`;
    }

    // Emergency request email body
    getEmergencyRequestEmailBody(requestData, matchingDonors) {
        const lang = localStorage.getItem('language') || 'en';
        const donorCount = matchingDonors.length;
        
        if (lang === 'ta') {
            return `அவசர இரத்த கோரிக்கை

இரத்த வகை: ${requestData.bloodType}
மருத்துவமனை: ${requestData.hospital}
மாவட்டம்: ${requestData.district || 'N/A'}
ஒன்றியம்: ${requestData.union || 'N/A'}
தொடர்பு: ${requestData.contact}

பொருந்தக்கூடிய தானம் செய்பவர்கள்: ${donorCount} பேர்

தயவுசெய்து உடனடியாக நடவடிக்கை எடுக்கவும்.

நன்றி,
AI-Based Intelligent Blood Donation Platform`;
        }
        
        return `Emergency Blood Request

Blood Type: ${requestData.bloodType}
Hospital: ${requestData.hospital}
District: ${requestData.district || 'N/A'}
Union: ${requestData.union || 'N/A'}
Contact: ${requestData.contact}

Matching Donors Found: ${donorCount}

Please take immediate action.

Thank you,
AI-Based Intelligent Blood Donation Platform`;
    }

    // Donor notification email body
    getDonorNotificationEmailBody(donor, requestData) {
        const lang = localStorage.getItem('language') || 'en';
        const donorName = donor.name || donor.Name;
        
        if (lang === 'ta') {
            return `வணக்கம் ${donorName},

அவசர இரத்த தேவை!

இரத்த வகை: ${requestData.bloodType}
மருத்துவமனை: ${requestData.hospital}
தொடர்பு: ${requestData.contact}
மாவட்டம்: ${requestData.district || 'N/A'}

உங்கள் உதவி தேவைப்படுகிறது. தயவுசெய்து மேலே உள்ள தொடர்பு எண்ணை தொடர்பு கொள்ளவும்.

நன்றி,
AI-Based Intelligent Blood Donation Platform`;
        }
        
        return `Hello ${donorName},

Urgent Blood Need!

Blood Type: ${requestData.bloodType}
Hospital: ${requestData.hospital}
Contact: ${requestData.contact}
District: ${requestData.district || 'N/A'}

Your help is needed. Please contact the number above.

Thank you,
AI-Based Intelligent Blood Donation Platform`;
    }

    // Send email via API (to be implemented with actual email service)
    async sendEmailViaAPI(to, subject, body) {
        // Integration with email service like SendGrid, Mailgun, etc.
        // Example:
        // const response = await fetch('YOUR_EMAIL_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ to, subject, body })
        // });
        // return await response.json();
        
        console.log('Email would be sent:', { to, subject, body });
        return { success: true };
    }
}

// Initialize email service
const emailService = new EmailService();
