interface PrivacySettings {
  dataCollection: {
    voiceRecording: boolean;
    textInput: boolean;
    behavioralAnalytics: boolean;
    emotionalAnalysis: boolean;
    learningProgress: boolean;
  };
  dataRetention: {
    sessionData: number; // hours
    personalPreferences: number; // days
    learningProgress: number; // days
    conversationHistory: number; // days
  };
  dataSharing: {
    thirdPartyAnalytics: boolean;
    educationalResearch: boolean;
    productImprovement: boolean;
  };
  parentalControls: {
    consentRequired: boolean;
    accessToData: boolean;
    deletionRights: boolean;
    activityReports: boolean;
  };
}

interface DataProcessingConsent {
  userId: string;
  timestamp: number;
  consentGiven: boolean;
  consentVersion: string;
  parentalConsent?: {
    given: boolean;
    parentEmail: string;
    verificationMethod: string;
    timestamp: number;
  };
  specificConsents: {
    voiceProcessing: boolean;
    emotionalAnalysis: boolean;
    learningTracking: boolean;
    dataRetention: boolean;
  };
}

interface DataExportRequest {
  userId: string;
  requestTimestamp: number;
  parentalRequest: boolean;
  requestorEmail: string;
  dataTypes: string[];
  status: 'pending' | 'approved' | 'completed' | 'denied';
  completionTimestamp?: number;
}

interface DataDeletionRequest {
  userId: string;
  requestTimestamp: number;
  parentalRequest: boolean;
  requestorEmail: string;
  deletionScope: 'partial' | 'complete';
  specificData?: string[];
  status: 'pending' | 'approved' | 'completed' | 'denied';
  completionTimestamp?: number;
  verificationRequired: boolean;
}

interface PrivacyAuditLog {
  timestamp: number;
  userId: string;
  action: string;
  dataType: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

class PrivacyService {
  private privacySettings: PrivacySettings;
  private userConsents: Map<string, DataProcessingConsent> = new Map();
  private exportRequests: Map<string, DataExportRequest> = new Map();
  private deletionRequests: Map<string, DataDeletionRequest> = new Map();
  private auditLog: PrivacyAuditLog[] = [];
  private encryptionKey: string;
  private dataProcessors: Map<string, any> = new Map();

  constructor() {
    this.privacySettings = this.getDefaultPrivacySettings();
    this.encryptionKey = this.generateEncryptionKey();
    this.initializeDataProcessors();
    this.startAuditLogCleanup();
  }

  private getDefaultPrivacySettings(): PrivacySettings {
    return {
      dataCollection: {
        voiceRecording: false, // Requires explicit consent
        textInput: true,       // Minimal data collection
        behavioralAnalytics: false, // Requires consent
        emotionalAnalysis: false,   // Requires consent
        learningProgress: true      // Educational purpose
      },
      dataRetention: {
        sessionData: 24,        // 24 hours
        personalPreferences: 7, // 7 days
        learningProgress: 30,   // 30 days
        conversationHistory: 7  // 7 days
      },
      dataSharing: {
        thirdPartyAnalytics: false,
        educationalResearch: false,
        productImprovement: false
      },
      parentalControls: {
        consentRequired: true,
        accessToData: true,
        deletionRights: true,
        activityReports: true
      }
    };
  }

  private generateEncryptionKey(): string {
    // In production, this would use a proper key management system
    return 'privacy_encryption_key_' + Date.now();
  }

  private initializeDataProcessors() {
    // Initialize data anonymization and encryption processors
    this.dataProcessors.set('anonymizer', {
      process: (data: any) => this.anonymizeData(data),
      reversible: false
    });

    this.dataProcessors.set('encryptor', {
      process: (data: any) => this.encryptData(data),
      reversible: true
    });

    this.dataProcessors.set('hasher', {
      process: (data: any) => this.hashSensitiveData(data),
      reversible: false
    });
  }

  // Consent Management
  public async requestConsent(
    userId: string,
    childAge: number,
    requiredConsents: string[],
    parentEmail?: string
  ): Promise<{ 
    consentRequired: boolean;
    parentalConsentRequired: boolean;
    consentUrl?: string;
    temporaryPermissions: string[];
  }> {
    const requiresParentalConsent = childAge < 13; // COPPA compliance
    
    // Check existing consent
    const existingConsent = this.userConsents.get(userId);
    if (existingConsent && this.isConsentValid(existingConsent)) {
      return {
        consentRequired: false,
        parentalConsentRequired: false,
        temporaryPermissions: this.getPermittedDataTypes(existingConsent)
      };
    }

    // Generate consent request
    const consentRequest = {
      userId,
      requiredConsents,
      parentalConsentRequired: requiresParentalConsent,
      parentEmail,
      timestamp: Date.now()
    };

    // Log consent request
    this.logPrivacyAction(userId, 'consent_requested', 'user_data', 
      `Consent requested for: ${requiredConsents.join(', ')}`);

    return {
      consentRequired: true,
      parentalConsentRequired: requiresParentalConsent,
      consentUrl: this.generateConsentUrl(consentRequest),
      temporaryPermissions: ['basic_interaction'] // Minimal permissions while consent pending
    };
  }

  public async recordConsent(
    userId: string,
    consentData: {
      voiceProcessing: boolean;
      emotionalAnalysis: boolean;
      learningTracking: boolean;
      dataRetention: boolean;
    },
    parentalConsent?: {
      parentEmail: string;
      verificationCode: string;
      consentGiven: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const consent: DataProcessingConsent = {
        userId,
        timestamp: Date.now(),
        consentGiven: true,
        consentVersion: '1.0',
        specificConsents: consentData
      };

      // Handle parental consent if provided
      if (parentalConsent) {
        if (!this.verifyParentalConsent(parentalConsent)) {
          return { success: false, error: 'Parental consent verification failed' };
        }
        
        consent.parentalConsent = {
          given: parentalConsent.consentGiven,
          parentEmail: parentalConsent.parentEmail,
          verificationMethod: 'email_verification',
          timestamp: Date.now()
        };
      }

      // Store consent
      this.userConsents.set(userId, consent);

      // Update privacy settings based on consent
      this.updatePrivacySettingsFromConsent(userId, consent);

      // Log consent recording
      this.logPrivacyAction(userId, 'consent_recorded', 'consent_data', 
        `Consent recorded with parental approval: ${!!parentalConsent}`);

      return { success: true };
    } catch (error) {
      console.error('Error recording consent:', error);
      return { success: false, error: 'Failed to record consent' };
    }
  }

  public revokeConsent(userId: string): boolean {
    try {
      const existingConsent = this.userConsents.get(userId);
      if (existingConsent) {
        existingConsent.consentGiven = false;
        existingConsent.timestamp = Date.now();
        this.userConsents.set(userId, existingConsent);
        
        // Trigger data deletion for non-essential data
        this.scheduleDataDeletion(userId, ['voice_data', 'emotional_analysis', 'behavioral_data']);
        
        this.logPrivacyAction(userId, 'consent_revoked', 'consent_data', 'User revoked consent');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error revoking consent:', error);
      return false;
    }
  }

  // Data Processing and Protection
  public async processUserData(
    userId: string,
    dataType: string,
    data: any,
    purpose: string
  ): Promise<{ processed: boolean; processedData?: any; error?: string }> {
    try {
      // Check consent
      if (!this.hasConsentForDataType(userId, dataType)) {
        return { 
          processed: false, 
          error: `No consent for ${dataType} processing` 
        };
      }

      // Apply privacy-preserving processing
      let processedData = data;

      // Anonymize if required
      if (this.requiresAnonymization(dataType)) {
        processedData = this.anonymizeData(processedData);
      }

      // Encrypt sensitive data
      if (this.isSensitiveData(dataType)) {
        processedData = this.encryptData(processedData);
      }

      // Hash identifiable information
      if (this.containsPersonalIdentifiers(processedData)) {
        processedData = this.hashSensitiveData(processedData);
      }

      // Log data processing
      this.logPrivacyAction(userId, 'data_processed', dataType, 
        `Data processed for purpose: ${purpose}`);

      // Schedule deletion based on retention policy
      this.scheduleDataDeletion(userId, [dataType], this.getRetentionPeriod(dataType));

      return { processed: true, processedData };
    } catch (error) {
      console.error('Error processing user data:', error);
      return { processed: false, error: 'Data processing failed' };
    }
  }

  private anonymizeData(data: any): any {
    if (typeof data === 'string') {
      // Remove or replace personal identifiers
      return data
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]')
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
        .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[NAME]');
    }
    
    if (typeof data === 'object' && data !== null) {
      const anonymized = { ...data };
      
      // Remove direct identifiers
      delete anonymized.name;
      delete anonymized.email;
      delete anonymized.phone;
      delete anonymized.address;
      
      // Replace with anonymized versions
      if (data.userId) {
        anonymized.userId = this.hashString(data.userId);
      }
      
      return anonymized;
    }
    
    return data;
  }

  private encryptData(data: any): string {
    // Simple encryption for demo - use proper encryption in production
    const dataString = JSON.stringify(data);
    return btoa(dataString + this.encryptionKey);
  }

  private decryptData(encryptedData: string): any {
    try {
      const decrypted = atob(encryptedData);
      const dataString = decrypted.replace(this.encryptionKey, '');
      return JSON.parse(dataString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  private hashSensitiveData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const hashed = { ...data };
      
      // Hash specific fields that might contain sensitive info
      if (data.sessionId) {
        hashed.sessionId = this.hashString(data.sessionId);
      }
      
      if (data.voiceData) {
        hashed.voiceData = this.hashString(JSON.stringify(data.voiceData));
      }
      
      return hashed;
    }
    
    return data;
  }

  private hashString(input: string): string {
    // Simple hash function for demo - use proper hashing in production
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  // Data Rights Management
  public async requestDataExport(
    userId: string,
    requestorEmail: string,
    parentalRequest: boolean = false
  ): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const requestId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const exportRequest: DataExportRequest = {
        userId,
        requestTimestamp: Date.now(),
        parentalRequest,
        requestorEmail,
        dataTypes: ['conversations', 'preferences', 'learning_progress', 'consent_records'],
        status: 'pending'
      };
      
      this.exportRequests.set(requestId, exportRequest);
      
      // Log the request
      this.logPrivacyAction(userId, 'data_export_requested', 'user_data', 
        `Data export requested by ${parentalRequest ? 'parent' : 'user'}`);
      
      // Schedule processing (in production, this would trigger an async process)
      setTimeout(() => {
        this.processDataExportRequest(requestId);
      }, 1000);
      
      return { success: true, requestId };
    } catch (error) {
      console.error('Error requesting data export:', error);
      return { success: false, error: 'Failed to submit export request' };
    }
  }

  public async requestDataDeletion(
    userId: string,
    requestorEmail: string,
    deletionScope: 'partial' | 'complete',
    specificData?: string[],
    parentalRequest: boolean = false
  ): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const requestId = `deletion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const deletionRequest: DataDeletionRequest = {
        userId,
        requestTimestamp: Date.now(),
        parentalRequest,
        requestorEmail,
        deletionScope,
        specificData,
        status: 'pending',
        verificationRequired: true
      };
      
      this.deletionRequests.set(requestId, deletionRequest);
      
      // Log the request
      this.logPrivacyAction(userId, 'data_deletion_requested', 'user_data', 
        `${deletionScope} deletion requested by ${parentalRequest ? 'parent' : 'user'}`);
      
      // Schedule processing
      setTimeout(() => {
        this.processDataDeletionRequest(requestId);
      }, 2000);
      
      return { success: true, requestId };
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      return { success: false, error: 'Failed to submit deletion request' };
    }
  }

  private async processDataExportRequest(requestId: string): Promise<void> {
    const request = this.exportRequests.get(requestId);
    if (!request) return;
    
    try {
      request.status = 'approved';
      
      // Collect user data
      const exportData = await this.collectUserDataForExport(request.userId, request.dataTypes);
      
      // In production, this would send the data securely to the user
      console.log('Data export ready for user:', request.userId);
      
      request.status = 'completed';
      request.completionTimestamp = Date.now();
      
      this.logPrivacyAction(request.userId, 'data_export_completed', 'user_data', 
        'Data export completed successfully');
        
    } catch (error) {
      console.error('Error processing export request:', error);
      request.status = 'denied';
    }
  }

  private async processDataDeletionRequest(requestId: string): Promise<void> {
    const request = this.deletionRequests.get(requestId);
    if (!request) return;
    
    try {
      request.status = 'approved';
      
      // Perform data deletion
      if (request.deletionScope === 'complete') {
        await this.deleteAllUserData(request.userId);
      } else if (request.specificData) {
        await this.deleteSpecificUserData(request.userId, request.specificData);
      }
      
      request.status = 'completed';
      request.completionTimestamp = Date.now();
      
      this.logPrivacyAction(request.userId, 'data_deletion_completed', 'user_data', 
        `${request.deletionScope} data deletion completed`);
        
    } catch (error) {
      console.error('Error processing deletion request:', error);
      request.status = 'denied';
    }
  }

  // Data Collection Validation
  public validateDataCollection(
    userId: string,
    dataType: string,
    purpose: string
  ): { allowed: boolean; reason?: string; alternatives?: string[] } {
    // Check consent
    if (!this.hasConsentForDataType(userId, dataType)) {
      return {
        allowed: false,
        reason: 'No user consent for this data type',
        alternatives: ['basic_interaction', 'anonymous_analytics']
      };
    }
    
    // Check privacy settings
    if (!this.isDataCollectionAllowed(dataType)) {
      return {
        allowed: false,
        reason: 'Data collection disabled in privacy settings',
        alternatives: ['aggregated_data', 'minimal_data']
      };
    }
    
    // Check purpose limitation
    if (!this.isPurposeLegitimate(purpose)) {
      return {
        allowed: false,
        reason: 'Purpose not aligned with legitimate interests',
        alternatives: ['educational_purpose', 'safety_purpose']
      };
    }
    
    return { allowed: true };
  }

  // Utility Methods
  private isConsentValid(consent: DataProcessingConsent): boolean {
    const consentAge = Date.now() - consent.timestamp;
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    
    return consent.consentGiven && consentAge < maxAge;
  }

  private hasConsentForDataType(userId: string, dataType: string): boolean {
    const consent = this.userConsents.get(userId);
    if (!consent || !this.isConsentValid(consent)) {
      return false;
    }
    
    const typeMapping: Record<string, keyof DataProcessingConsent['specificConsents']> = {
      'voice_data': 'voiceProcessing',
      'emotional_analysis': 'emotionalAnalysis',
      'learning_progress': 'learningTracking',
      'conversation_history': 'dataRetention'
    };
    
    const consentKey = typeMapping[dataType];
    return consentKey ? consent.specificConsents[consentKey] : true;
  }

  private requiresAnonymization(dataType: string): boolean {
    const anonymizationRequired = ['voice_data', 'conversation_history', 'behavioral_data'];
    return anonymizationRequired.includes(dataType);
  }

  private isSensitiveData(dataType: string): boolean {
    const sensitiveTypes = ['voice_data', 'emotional_analysis', 'personal_preferences'];
    return sensitiveTypes.includes(dataType);
  }

  private containsPersonalIdentifiers(data: any): boolean {
    if (typeof data === 'string') {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b/;
      return emailRegex.test(data) || phoneRegex.test(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      return data.hasOwnProperty('email') || 
             data.hasOwnProperty('phone') || 
             data.hasOwnProperty('name');
    }
    
    return false;
  }

  private isDataCollectionAllowed(dataType: string): boolean {
    const typeMapping: Record<string, keyof PrivacySettings['dataCollection']> = {
      'voice_data': 'voiceRecording',
      'text_input': 'textInput',
      'behavioral_data': 'behavioralAnalytics',
      'emotional_analysis': 'emotionalAnalysis',
      'learning_progress': 'learningProgress'
    };
    
    const settingKey = typeMapping[dataType];
    return settingKey ? this.privacySettings.dataCollection[settingKey] : false;
  }

  private isPurposeLegitimate(purpose: string): boolean {
    const legitimatePurposes = [
      'educational_content',
      'safety_monitoring',
      'user_experience',
      'technical_support',
      'compliance'
    ];
    
    return legitimatePurposes.includes(purpose);
  }

  private getRetentionPeriod(dataType: string): number {
    const typeMapping: Record<string, keyof PrivacySettings['dataRetention']> = {
      'session_data': 'sessionData',
      'personal_preferences': 'personalPreferences',
      'learning_progress': 'learningProgress',
      'conversation_history': 'conversationHistory'
    };
    
    const settingKey = typeMapping[dataType];
    return settingKey ? this.privacySettings.dataRetention[settingKey] : 24; // Default 24 hours
  }

  private scheduleDataDeletion(
    userId: string, 
    dataTypes: string[], 
    retentionHours?: number
  ): void {
    const deletionTime = retentionHours || 24;
    
    setTimeout(() => {
      this.deleteSpecificUserData(userId, dataTypes);
    }, deletionTime * 60 * 60 * 1000);
  }

  private async deleteAllUserData(userId: string): Promise<void> {
    // Remove from all data stores
    this.userConsents.delete(userId);
    
    // Clear from other services (would integrate with other services)
    console.log(`All data deleted for user: ${userId}`);
    
    this.logPrivacyAction(userId, 'data_deleted', 'all_data', 'Complete user data deletion');
  }

  private async deleteSpecificUserData(userId: string, dataTypes: string[]): Promise<void> {
    dataTypes.forEach(dataType => {
      // Delete specific data types (would integrate with data stores)
      console.log(`Deleted ${dataType} for user: ${userId}`);
    });
    
    this.logPrivacyAction(userId, 'data_deleted', 'specific_data', 
      `Deleted data types: ${dataTypes.join(', ')}`);
  }

  private async collectUserDataForExport(userId: string, dataTypes: string[]): Promise<any> {
    const exportData: any = {};
    
    dataTypes.forEach(dataType => {
      // Collect data from various services
      exportData[dataType] = `[${dataType} data for ${userId}]`;
    });
    
    return exportData;
  }

  private logPrivacyAction(
    userId: string,
    action: string,
    dataType: string,
    details: string
  ): void {
    const logEntry: PrivacyAuditLog = {
      timestamp: Date.now(),
      userId,
      action,
      dataType,
      details
    };
    
    this.auditLog.push(logEntry);
    
    // Keep audit log size manageable
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-5000);
    }
  }

  private startAuditLogCleanup(): void {
    // Clean up old audit logs every day
    setInterval(() => {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      this.auditLog = this.auditLog.filter(log => log.timestamp > thirtyDaysAgo);
    }, 24 * 60 * 60 * 1000);
  }

  private verifyParentalConsent(parentalConsent: any): boolean {
    // In production, this would verify the parent's identity and consent
    return parentalConsent.verificationCode === 'valid_code';
  }

  private generateConsentUrl(consentRequest: any): string {
    // Generate a secure consent URL
    return `https://app.oldtom.com/consent?request=${btoa(JSON.stringify(consentRequest))}`;
  }

  private updatePrivacySettingsFromConsent(userId: string, consent: DataProcessingConsent): void {
    // Update privacy settings based on user consent
    this.privacySettings.dataCollection.voiceRecording = consent.specificConsents.voiceProcessing;
    this.privacySettings.dataCollection.emotionalAnalysis = consent.specificConsents.emotionalAnalysis;
    this.privacySettings.dataCollection.learningProgress = consent.specificConsents.learningTracking;
  }

  private getPermittedDataTypes(consent: DataProcessingConsent): string[] {
    const permissions: string[] = ['basic_interaction'];
    
    if (consent.specificConsents.voiceProcessing) {
      permissions.push('voice_data');
    }
    
    if (consent.specificConsents.emotionalAnalysis) {
      permissions.push('emotional_analysis');
    }
    
    if (consent.specificConsents.learningTracking) {
      permissions.push('learning_progress');
    }
    
    return permissions;
  }

  // Public API Methods
  public getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings };
  }

  public updatePrivacySettings(updates: Partial<PrivacySettings>): boolean {
    try {
      this.privacySettings = { ...this.privacySettings, ...updates };
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return false;
    }
  }

  public getUserConsent(userId: string): DataProcessingConsent | null {
    return this.userConsents.get(userId) || null;
  }

  public getAuditLog(userId?: string): PrivacyAuditLog[] {
    if (userId) {
      return this.auditLog.filter(log => log.userId === userId);
    }
    return this.auditLog.slice(); // Return copy
  }

  public generatePrivacyReport(): {
    totalUsers: number;
    consentedUsers: number;
    dataExportRequests: number;
    dataDeletionRequests: number;
    auditLogEntries: number;
  } {
    return {
      totalUsers: this.userConsents.size,
      consentedUsers: Array.from(this.userConsents.values())
        .filter(consent => consent.consentGiven).length,
      dataExportRequests: this.exportRequests.size,
      dataDeletionRequests: this.deletionRequests.size,
      auditLogEntries: this.auditLog.length
    };
  }
}

export const privacyService = new PrivacyService();
export default PrivacyService;