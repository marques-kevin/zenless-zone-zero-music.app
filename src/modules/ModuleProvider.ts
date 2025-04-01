import { IModule } from "@/interfaces/IModule";
import { DevelopmentModule } from "./DevelopmentModule";
import { ProductionModule } from "./ProductionModule";
import { TestModule } from "./TestModule";

export class ModuleProvider implements IModule {
  build(env?: "production" | "development" | "test") {
    const environment = env || process.env.NODE_ENV || "development";

    if (environment === "development") return new DevelopmentModule().build();
    if (environment === "test") return new TestModule().build();
    if (environment === "production") return new ProductionModule().build();

    throw new Error(`environment(${environment}) is not valid`);
  }
}
