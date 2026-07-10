import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import CreateProjectPage from '../pages/admin/CreateProjectPage.jsx';

vi.mock('../api/apiFetch', () => ({
  apiFetch: vi.fn().mockResolvedValue([]),
}));

describe('CreateProjectPage', () => {
  it('affiche le formulaire de création de projet', async () => {
    render(
      <MemoryRouter>
        <CreateProjectPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /nouveau projet/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /créer le projet/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/nom du projet/i)
    ).toBeInTheDocument();
  });
});