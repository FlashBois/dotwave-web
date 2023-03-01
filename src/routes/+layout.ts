import { createProtocolState, loadProtocolState } from '$src/stores/protocolStateStore';

export const load = async () => {
	await createProtocolState()
	await loadProtocolState()
};
