import {
	BEGIN_DRAG,
	PUBLISH_DRAG_SOURCE,
	HOVER,
	END_DRAG,
	DROP,
} from '../actions/dragDrop'
import { REMOVE_TARGET } from '../actions/registry'
import { Identifier, Action } from '../interfaces'
const without = require('lodash/without')

export interface Meta {
	event: object
}

export interface State {
	itemType: Identifier | Identifier[] | null
	item: any,
	itemOption: any,
	sourceId: string | null
	targetIds: string[]
	dropResult: any
	didDrop: boolean
	isSourcePublic: boolean | null,
	meta: Meta
}

const initialState: State = {
	itemType: null,
	item: null,
	itemOption: null,
	sourceId: null,
	targetIds: [],
	dropResult: null,
	didDrop: false,
	isSourcePublic: null,
	meta: {event: {}}
}

export default function dragOperation(
	state: State = initialState,
	action: Action<{
		itemType: Identifier | Identifier[]
		item: any
		itemOption: any,
		sourceId: string
		targetId: string
		targetIds: string[]
		isSourcePublic: boolean
		dropResult: any,
		meta: Meta
	}>,
) {
	const { payload } = action
	switch (action.type) {
		case BEGIN_DRAG:
			return {
				...state,
				itemType: payload.itemType,
				item: payload.item,
				itemOption: payload.itemOption,
				sourceId: payload.sourceId,
				isSourcePublic: payload.isSourcePublic,
				dropResult: null,
				didDrop: false,
				meta: payload.meta
			}
		case PUBLISH_DRAG_SOURCE:
			return {
				...state,
				isSourcePublic: true,
			}
		case HOVER:
			return {
				...state,
				targetIds: payload.targetIds,
				meta: payload.meta
			}
		case REMOVE_TARGET:
			if (state.targetIds.indexOf(payload.targetId) === -1) {
				return state
			}
			return {
				...state,
				targetIds: without(state.targetIds, payload.targetId),
			}
		case DROP:
			return {
				...state,
				dropResult: payload.dropResult,
				didDrop: true,
				targetIds: [],
				meta: payload.meta
			}
		case END_DRAG:
			return {
				...state,
				itemType: null,
				item: null,
				sourceId: null,
				dropResult: null,
				didDrop: false,
				isSourcePublic: null,
				targetIds: []
			}
		default:
			return state
	}
}
