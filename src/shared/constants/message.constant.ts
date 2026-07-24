import { config } from "../../config";
import { FileUtil } from "../utils/file.util";

export const SuccessMessageConstant = {
    EntityCreated: (entityName: string) => `${entityName} created successfully`,
    EntityUploaded: (entityName: string) =>
        `${entityName} uploaded successfully`,
    EntityUpdated: (entityName: string) => `${entityName} updated successfully`,
    EntityDeleted: (entityName: string) => `${entityName} deleted successfully`,
    EntityRetrieved: (entityName: string) =>
        `${entityName} retrieved successfully`,
    EntitiesRetrieved: (entityName: string) =>
        `${entityName} retrieved successfully`,

    FileUploaded: 'File uploaded successfully',
    FileDeleted: 'File deleted successfully',
    FileRetrieved: 'File retrieved successfully',

    CsvImported: 'CSV file imported successfully',
    ExcelImported: 'Excel file imported successfully',

    CsvExported: 'CSV file exported successfully',
    ExcelExported: 'Excel file exported successfully',
    PdfExported: 'PDF file exported successfully',

    Action: (action: string) => `${action} successfully`,
} as const;

export const ErrorMessageConstant = {
    UnprocessableEntity: 'Unprocessable Entity',
    Unauthorized: 'Not Authorized',
    ForbiddenAccess: 'Forbidden Access',
    NotFound: 'Not Found',
    InternalServerError: 'Internal Server Error',
    BadRequest: 'Bad Request',
    Conflict: 'Conflict',
    TooManyRequests: 'Too Many Requests',
    ValidationError: 'Validation Error',
    FieldRequired: 'Field Required',
    FieldRequiredWithName: (fieldName: string) =>
        `Field ${fieldName} is required`,
    FieldInvalidValue: 'Field Invalid Value',
    FieldInvalidValueWithName: (fieldName: string, expectedType?: string) =>
        `Field ${fieldName} has an invalid value${expectedType ? `, expected ${expectedType}` : ''}`,
    FieldMinLength: (fieldName: string, length: number) =>
        `${fieldName} must be at least ${length} characters`,
    FieldExactLength: (fieldName: string, length: number) =>
        `${fieldName} must be exactly ${length} character${length > 1 ? 's' : ''}`,
    FieldArrayMinLength: (fieldName: string, length: number) =>
        `${fieldName} must contain at least ${length} item${length > 1 ? 's' : ''}`,
    FieldMustBePositive: (fieldName: string) => `${fieldName} must be positive`,
    FieldInvalidFormat: (fieldName: string, format: string) =>
        `${fieldName} must be in format ${format}`,
    QueryError: 'Query Error',
    DataNotFound: 'Data Not Found',
    DataEntityNotFound: (entityName: string) => `Data ${entityName} not found`,
    DataEntityFieldAlreadyExists: (entityName: string, fieldName: string) =>
        `Data ${entityName} with ${fieldName} already exists`,
    DataEntityFieldNotFound: (entityName: string, fieldName: string) =>
        `Data ${entityName} with ${fieldName} not found`,
    FieldDuplicate: 'Field Duplicate',
    FieldDuplicateWithName: (fieldName: string) =>
        `Field ${fieldName} is duplicate`,
    DataNotDeleted: 'Error, Data not deleted',
    DataEntityReferencedByOther: (entityName: string, referencedBy: string) =>
        `Data ${entityName} is referenced by ${referencedBy}`,
    DataEntityInInvalidState: (entityName: string, state: string) =>
        `Data ${entityName} is ${state}`,
    DataEntityDoesNotHaveRequiredAttribute: (params: {
        entityName: string;
        identifier: string;
        requiredAttribute: string;
        context: string;
    }) =>
        `Data ${params.entityName} ${params.identifier} does not have the required ${params.requiredAttribute} for ${params.context}`,

    /**
     * Error messages related to workflow operations
     */
    DraftAlreadyExists: (entityName: string) =>
        `A draft ${entityName} already exists for this project`,
    PrerequisiteEntitiesState: (entities: string, state: string) =>
        `${entities} must exist before ${state}`,
    EntityNotAssignedToOther: (entityName: string, targetEntity: string) =>
        `${entityName} is not assigned to this ${targetEntity}`,
    EntityAlreadyApprovedBy: (entityName: string, approver: string) =>
        `This ${entityName} has already been approved by ${approver}`,
    EntityForbidden: (entityName: string) =>
        `${entityName} are not allowed to perform this operation`,

    /**
     * Error messages related to auth operations
     */
    InvalidCredentials: 'Invalid credentials',
    UserAccountInactive: 'User account is inactive',
    UserRegistrationNotYetApproved: 'User registration is not yet approved',

    /**
     * Error messages related to file operations
     */
    FileNotProvided: 'No file provided',
    FileUpload: 'Error Uploading File',
    FileDelete: 'Error Deleting File',
    FileRetrieve: 'Error Retrieving File',
    FileTooLarge: `File size exceeds the maximum limit of ${FileUtil.formatFileSizeBytes(config.storage.fileMaxSizeInBytes)}`,
    InvalidFileMimeType: `Invalid file type. Allowed types: ${FileUtil.validFileMimeTypes.join(', ')}`,
    InvalidSpecificFileMimeType: (allowedTypes: string[]) =>
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    FileNotFound: 'File not found',

    /**
     * Error messages related to csv import
     */
    CsvImportError: 'Error Importing CSV File',
    CsvImportNoHeaders: 'No headers found in CSV file',
    CsvImportTemplateReadFailed: 'Failed to read template file',
    CsvImportInsufficientRows: 'Input CSV file has insufficient rows',
    CsvImportTemplateNoHeaders: 'No headers found in template file',
    CsvImportMissingHeaders: 'Missing required headers in CSV file',
    CsvImportInputInsufficientRows: 'Input CSV file has insufficient rows',
    CsvImportInputNoHeaders: 'No headers found in input CSV file',

    /**
     * Error messages related to user passwords
     */
    PasswordTooWeak:
        'Password too weak, must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    PasswordTooShort: (length = 8) =>
        `Password must be at least ${length} characters long`,
    PasswordNotMatch: 'Passwords don\'t match',

    /**
     * Error message related to user phone
     */
    PhoneNumberInvalidFormatID:
        'Should start with 62, followed by 9 to 13 digits (excluding 62)',

    /**
     * Error message related to identifier
     */
    InvalidEmailFormat: 'Invalid email format',
    InvalidUsernameFormat:
        'Username must be 3-20 characters, contain only letters, numbers, hyphens or underscores, and start/end with a letter or number',

    /**
     * Error message related to JWT tokens
     */
    InvalidOrExpiredToken: 'Invalid or expired token',

    /**
     * Error message related to OTP verification
     */
    EmailAlreadyVerifiedByOtp: 'Email is already verified by OTP',
    OtpResendCooldown: (remainingSeconds: number) =>
        `Please wait ${remainingSeconds} seconds before requesting a new OTP`,

    /**
     * Error messages related to reCAPTCHA v2 validation
     */
    RecaptchaTokenRequired: 'reCAPTCHA token is required',
    RecaptchaValidationFailed: 'reCAPTCHA validation failed',
} as const;
