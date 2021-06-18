export const TYPES = {
    ADD_LINK: 'ADD_LINK',
    FILL_LINKS: 'FILL_LINKS',
    EDIT_LINK: 'EDIT_LINK',
    SELECTED_LINK: 'SELECTED_LINK',
    REMOVE_SELECTED_LINK: "REMOVE_SELECTED_LINK",
}

const INITIAL_LINKS = []

export function linksReducer(state = INITIAL_LINKS, { type, ...rest }) {
    switch (type) {
        case TYPES.ADD_LINK:
            return [...state, rest.payload];
        case TYPES.FILL_LINKS:
            return rest.payload;
        case TYPES.EDIT_LINK:
            const index = state.findIndex(link => (link.id) === rest.payload.id)
            state[index] = rest.payload
            return [...state];
        default:
            return state
    }
}

const INITIAL_LINK = {}

export function linkReducer(state = INITIAL_LINK, { type, ...rest }) {
    switch (type) {
        case TYPES.SELECTED_LINK:
            return { ...state, ...rest.payload };
        case TYPES.REMOVE_SELECTED_LINK:
            return {};
        default:
            return state
    }
}

export const Actions = {
    addOne: (data) => ({
        type: TYPES.ADD_LINK,
        payload: data
    }),
    fillSome: (data) => ({
        type: TYPES.FILL_LINKS,
        payload: data
    }),
    editOne: (data) => ({
        type: TYPES.EDIT_LINK,
        payload: data
    }),
    selectOne: (data) => ({
        type: TYPES.SELECTED_LINK,
        payload: data
    }),
    removeSelected: () => ({
        type: TYPES.REMOVE_SELECTED_LINK,
    })
}