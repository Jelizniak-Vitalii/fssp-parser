export class Client {
  constructor(name, birthDate) {
    this.dob = birthDate;
    this.setName(name);
  }

  get isClientValid() {
    return !!(this.firstName && this.lastName && this.patronymic && this.dob);
  }

  setName(name) {
    this.firstName = name.split(' ')[1];
    this.lastName = name.split(' ')[0];
    this.patronymic = name.split(' ')[2];
  }
}
