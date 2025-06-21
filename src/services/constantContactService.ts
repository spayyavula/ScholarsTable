// Constant Contact Service for email marketing integration
// This would integrate with Constant Contact API in a real implementation

export interface Contact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  customFields?: Record<string, any>;
  lists?: string[];
  tags?: string[];
  source?: string;
  subscribeDate?: string;
  lastModified?: string;
}

export interface EmailCampaign {
  id?: string;
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  htmlContent: string;
  textContent?: string;
  lists: string[];
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  stats?: {
    sent: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    openRate: number;
    clickRate: number;
  };
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  createdDate: string;
  modifiedDate: string;
}

export interface AutomationSequence {
  id?: string;
  name: string;
  description?: string;
  trigger: {
    type: 'list_join' | 'tag_added' | 'custom_field_changed' | 'date_based';
    conditions: Record<string, any>;
  };
  emails: {
    id: string;
    subject: string;
    delay: number; // days after trigger
    htmlContent: string;
    textContent?: string;
  }[];
  status: 'active' | 'paused' | 'draft';
}

class ConstantContactService {
  private apiUrl = '/api/constant-contact'; // Netlify function endpoint

  // Contact Management
  async createContact(contact: Contact): Promise<Contact> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error('Failed to create contact');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async getContact(email: string): Promise<Contact | null> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch contact');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async addContactToList(contactId: string, listId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/${contactId}/lists/${listId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to add contact to list');
      }
    } catch (error) {
      console.error('Error adding contact to list:', error);
      throw error;
    }
  }

  async removeContactFromList(contactId: string, listId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/${contactId}/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove contact from list');
      }
    } catch (error) {
      console.error('Error removing contact from list:', error);
      throw error;
    }
  }

  // List Management
  async createList(name: string, description?: string): Promise<ContactList> {
    try {
      const response = await fetch(`${this.apiUrl}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  }

  async getLists(): Promise<ContactList[]> {
    try {
      const response = await fetch(`${this.apiUrl}/lists`);

      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  }

  // Campaign Management
  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'stats'>): Promise<EmailCampaign> {
    try {
      const response = await fetch(`${this.apiUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async sendCampaign(campaignId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    }
  }

  async scheduleCampaign(campaignId: string, scheduledDate: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule campaign');
      }
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      throw error;
    }
  }

  async getCampaignStats(campaignId: string): Promise<EmailCampaign['stats']> {
    try {
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch campaign stats');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      throw error;
    }
  }

  // Automation
  async createAutomation(automation: Omit<AutomationSequence, 'id'>): Promise<AutomationSequence> {
    try {
      const response = await fetch(`${this.apiUrl}/automations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automation),
      });

      if (!response.ok) {
        throw new Error('Failed to create automation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  }

  async activateAutomation(automationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/automations/${automationId}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to activate automation');
      }
    } catch (error) {
      console.error('Error activating automation:', error);
      throw error;
    }
  }

  // Utility Methods
  async subscribeToNewsletter(email: string, firstName?: string, interests?: string[]): Promise<Contact> {
    try {
      // Check if contact exists
      let contact = await this.getContact(email);
      
      if (!contact) {
        // Create new contact
        contact = await this.createContact({
          email,
          firstName,
          lists: ['newsletter'], // Default newsletter list
          tags: interests || [],
          source: 'website_signup',
          subscribeDate: new Date().toISOString(),
        });
      } else {
        // Update existing contact
        contact = await this.updateContact(contact.id!, {
          firstName: firstName || contact.firstName,
          tags: [...(contact.tags || []), ...(interests || [])],
          lists: [...(contact.lists || []), 'newsletter'],
        });
      }

      return contact;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    try {
      const welcomeCampaign: Omit<EmailCampaign, 'id' | 'stats'> = {
        name: `Welcome Email - ${email}`,
        subject: `Welcome to Scholars Table, ${firstName || 'Scholar'}! 🎓`,
        fromEmail: 'hello@scholarstable.com',
        fromName: 'Scholars Table Team',
        replyToEmail: 'support@scholarstable.com',
        htmlContent: this.getWelcomeEmailTemplate(firstName || 'Scholar'),
        lists: [], // Send to specific contact
        status: 'draft',
      };

      const campaign = await this.createCampaign(welcomeCampaign);
      await this.sendCampaign(campaign.id!);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Scholars Table</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Welcome to Scholars Table! 🎓</h1>
          </div>
          
          <p>Hi ${firstName},</p>
          
          <p>Welcome to the Scholars Table community! We're thrilled to have you join thousands of learners who are transforming their education through gamified learning.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
            <ul>
              <li>🎮 Start with our beginner-friendly quizzes</li>
              <li>💻 Try our interactive coding challenges</li>
              <li>🏆 Join tournaments to compete with other learners</li>
              <li>🤖 Get help from Bob, your AI learning assistant</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://scholarstable.com/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Learning Now</a>
          </div>
          
          <p>If you have any questions, just reply to this email. We're here to help!</p>
          
          <p>Happy learning!<br>
          The Scholars Table Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            You received this email because you signed up for Scholars Table. 
            <a href="[UNSUBSCRIBE_URL]" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

export const constantContactService = new ConstantContactService();