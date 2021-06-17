export const TYPES = {
    ADD_LINK: 'ADD_LINK',
    FILL_LINKS: 'FILL_LINKS',
    EDIT_LINK: 'EDIT_LINK',
}

const INITIAL = []

export function linksReducer(state = INITIAL, { type, ...rest }) {
    switch (type) {
        case TYPES.ADD_LINK:
            return [...state, rest.link];
        case TYPES.FILL_LINKS:
            return rest.links;
        case TYPES.EDIT_LINK:
            const index = state.findIndex(link => (link.id) === rest.link.id)
            state[index] = rest.link
            return [...state];
        default:
            return state
    }
}

export const Actions = {
    addOne: (data) => ({
        type: TYPES.ADD_LINK,
        link: data
    }),
    fillSome: (list) => ({
        type: TYPES.FILL_LINKS,
        links: list
    }),
    editOne: (data) => ({
        type: TYPES.EDIT_LINK,
        link: data
    })
}