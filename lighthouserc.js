module.exports = {
  ci: {
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:recommended",
    },
    collect: {
      staticDistDir: "./public"
    }
    
  },
};