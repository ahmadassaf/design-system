import Pill, { pillVariants } from '../Pill';

export const badgeVariants = pillVariants;

// Compatibility alias. Pill is the canonical Core label/status component.
const Badge = (props) => <Pill { ...props } />;

export default Badge;
