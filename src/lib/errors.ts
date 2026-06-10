export class AppError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AppError'
  }
}

export class SettingsError extends AppError {
  constructor(message: string) {
    super(message)
    this.name = 'SettingsError'
  }
}

export class RegistrationError extends AppError {
  constructor(message: string) {
    super(message)
    this.name = 'RegistrationError'
  }
}
