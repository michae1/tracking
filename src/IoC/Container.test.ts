import { Container } from './Container';


type IModule = {
  a: number
}

const myData = {
	a:3
}

const myOtherData = {
  a:5
}

test('expect container will register object (as value) and gives it back', () => {
  const container = new Container();
  container.register("IModule", myData);
  const resolvedData = container.resolve<IModule>("IModule");
  expect(resolvedData.a).toBe(3);
});

test('expect container will register multiple objects and gives first one back', () => {
  const container = new Container();
  container.register("IModule", myData);
  container.register("IModule", myOtherData);
  const resolvedData = container.resolve<IModule>("IModule");
  expect(resolvedData.a).toBe(3);
});

test('expect container will register multiple objects and gives all back', () => {
  const container = new Container();
  container.register("IModule", myData);
  container.register("IModule", myOtherData);
  const resolvedData = container.resolveAll<IModule>("IModule");
  expect(resolvedData.length).toBe(2);
});

test('expect container will register multiple objects and unregister one', () => {
  const container = new Container();
  container.register("IModule", myData);
  container.register("IModule", myOtherData);
  container
  const resolvedData = container.resolveAll<IModule>("IModule");
  expect(resolvedData.length).toBe(2);
});