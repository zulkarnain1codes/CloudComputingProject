// Backend configuration for demo switching
// Each entry maps to a deployed backend implementation

export type BackendType = 'ec2' | 'ecs' | 'lambda';

export interface BackendConfig {
  label: string;
  url: string;
  description: string;
}

export const BACKENDS: Record<BackendType, BackendConfig> = {
  ec2: {
    label: 'EC2',
    url: import.meta.env.VITE_EC2_URL || 'http://YOUR_EC2_IP',
    description: 'Virtual server',
  },
  ecs: {
    label: 'ECS',
    url: import.meta.env.VITE_ECS_URL || 'http://YOUR_ECS_URL',
    description: 'Container',
  },
  lambda: {
    label: 'Lambda',
    url: import.meta.env.VITE_LAMBDA_URL || 'https://YOUR_API_GATEWAY_URL',
    description: 'Serverless',
  },
};

const STORAGE_KEY = 'selectedBackend';

export function getActiveBackend(): BackendType {
  const stored = localStorage.getItem(STORAGE_KEY) as BackendType;
  return stored && stored in BACKENDS ? stored : 'ec2';
}

export function setActiveBackend(backend: BackendType): void {
  localStorage.setItem(STORAGE_KEY, backend);
}

export function getApiUrl(): string {
  return BACKENDS[getActiveBackend()].url;
}
