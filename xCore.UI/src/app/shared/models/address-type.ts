export enum AddressTypes {
  Classic = 1,
  Segwit = 2
}

export class AddressType {
  constructor() {
    let savedAddressType: string = localStorage.getItem('addressType');

    if (savedAddressType === undefined || savedAddressType == null || savedAddressType == "") {
      let defaultType = AddressTypes.Segwit;
      this.changeType(defaultType);
      this.Type = defaultType;
    } else {
      this.Type = Number(savedAddressType);
    }
  }

  public Type: AddressTypes;

  public IsSegwit(): string {
    return (this.Type == AddressTypes.Segwit).toString().toLowerCase();
  }

  public changeType(type: AddressTypes) {
    this.Type = type;
    localStorage.setItem('addressType', type.toString());
  }
}
