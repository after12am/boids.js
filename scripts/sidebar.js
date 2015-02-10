$('.sidebar').simpleSidebar({
    settings: {
        opener: "#open-sb",
        wrapper: "#wrapper",
    },
    sidebar: {
        align: "left",
        width: 250,
        closingLinks: "a",
        style: {
            zIndex: 100
        }
    },
    mask: {
        style: {
            backgroundColor: "grey",
            opacity: 0.6,
            filter: 'Alpha(opacity=60)'
        }
    }
});