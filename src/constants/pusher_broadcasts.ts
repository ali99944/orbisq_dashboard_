const PusherBroadcasts = Object.freeze({
    channels: {
        orders_channel: 'orders-channel',
        website_client_channel: 'emenu-website-client'
    },

    events: {
        order_event: {
            created: 'order.created',
            updated: 'order.updated',
        },

        free_up_table: 'free-up-table'
    }
})

export default PusherBroadcasts