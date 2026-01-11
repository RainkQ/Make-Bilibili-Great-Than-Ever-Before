import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';

export class ConfigManager {
  private config: Record<string, boolean> = {};
  private readonly storageKey = 'module_config';
  private menuIds: Record<string, any> = {};

  async load(): Promise<void> {
    try {
      // @ts-ignore
      this.config = await GM.getValue(this.storageKey, {});
    } catch (e) {
      console.error('Failed to load config', e);
      this.config = {};
    }
  }

  isEnabled(module: MakeBilibiliGreatThanEverBeforeModule): boolean {
    return this.config[module.id] ?? module.defaultEnabled ?? true;
  }

  async setEnabled(moduleId: string, enabled: boolean): Promise<void> {
    this.config[moduleId] = enabled;
    try {
      // @ts-ignore
      await GM.setValue(this.storageKey, this.config);
    } catch (e) {
      console.error('Failed to save config', e);
    }
  }

  registerMenuCommand(modules: MakeBilibiliGreatThanEverBeforeModule[]) {
    // Sort modules by name to make the menu looks better
    const sortedModules = [...modules].sort((a, b) => a.name.localeCompare(b.name));

    for (const module of sortedModules) {
      this.registerSingleCommand(module);
    }
  }

  private registerSingleCommand(module: MakeBilibiliGreatThanEverBeforeModule) {
    const isEnabled = this.isEnabled(module);
    const statusSymbol = isEnabled ? '✅' : '❌';
    const name = `${statusSymbol} ${module.name}`;

    // @ts-ignore
    const menuId = GM.registerMenuCommand(name, async () => {
      await this.toggleModule(module);
    });

    this.menuIds[module.id] = menuId;
  }

  private async toggleModule(module: MakeBilibiliGreatThanEverBeforeModule) {
    const currentState = this.isEnabled(module);
    const newState = !currentState;
    await this.setEnabled(module.id, newState);

    // Update menu item
    const oldMenuId = this.menuIds[module.id];
    if (oldMenuId !== undefined) {
      try {
        // @ts-ignore
        GM.unregisterMenuCommand(oldMenuId);
      } catch (e) {
        // Ignore error if unregister fails (some environments might not support it)
      }
    }
    
    this.registerSingleCommand(module);
  }
}

export const configManager = new ConfigManager();