import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../components/KPICard';

describe('KPICard', () => {
    it('renders title and value', () => {
        render(<KPICard title="Total Orders" value={150} />);

        expect(screen.getByText('Total Orders')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('displays positive change with green color', () => {
        render(<KPICard title="Revenue" value="$1,000" change={12.5} />);

        expect(screen.getByText('12.5%')).toBeInTheDocument();
    });

    it('displays negative change with red color', () => {
        render(<KPICard title="Delivery Time" value="28m" change={-3.1} />);

        expect(screen.getByText('3.1%')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(
            <KPICard
                title="Active Deliveries"
                value={45}
                description="in progress"
            />
        );

        expect(screen.getByText('in progress')).toBeInTheDocument();
    });
});
