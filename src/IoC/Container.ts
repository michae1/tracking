// Pretty simple IoC container to store just values for this time

export class Container {
  registered = new Map();

  // Registering the instances
  register(identifier: string, value: any) {
    console.log('registering ', identifier);
    if (!this.registered.has(identifier)) {
      this.registered.set(identifier, [value]);  
    } else {
      this.registered.set(identifier, [...this.registered.get(identifier), value]);
    }
    
  }

  unregister(identifier: string, value: any) {
    const targets = this.registered.get(identifier);
    this.registered.set(identifier, this.registered.get(identifier).filter((x:any)=>x!==value));

  }
  resolve<T>(identifier: string) : T {
    console.log('resolving, ',identifier);
    const target = this.registered.get(identifier);
    return target[0];
  }

  resolveAll<T>(identifier: string) : T[] {
    const targets = this.registered.get(identifier);
    return targets;
  }
}

export const container = new Container();