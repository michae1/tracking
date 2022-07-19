export class QueueProcessor {
  static run(): void {
    console.log("running");
  }
  static init(): void {
    setInterval(() => {
      QueueProcessor.run();
    }, 1000);
  }
}
