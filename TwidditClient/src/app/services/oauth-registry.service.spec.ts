import { TestBed } from '@angular/core/testing';

import { OauthRegistryService } from './oauth-registry.service';

describe('OauthRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OauthRegistryService = TestBed.get(OauthRegistryService);
    expect(service).toBeTruthy();
  });
});
