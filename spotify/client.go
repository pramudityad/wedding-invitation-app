package spotify

import (
	"net/http"

	"wedding-invitation-backend/config"

	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

var (
	authClient *spotifyauth.Authenticator
	client     *spotify.Client
)

func Init() {
	authClient = spotifyauth.New(
		spotifyauth.WithClientID(config.SpotifyClientId),
		spotifyauth.WithClientSecret(config.SpotifyClientSecret),
		spotifyauth.WithRedirectURL(config.SpotifyRedirectURI),
		spotifyauth.WithScopes(
			spotifyauth.ScopeUserReadPrivate,
			spotifyauth.ScopePlaylistReadPrivate,
			spotifyauth.ScopeUserModifyPlaybackState,
		),
	)
}

func GetClient() *spotify.Client {
	return client
}

func SetClient(c *spotify.Client) {
	client = c
}

func CompleteAuth(w http.ResponseWriter, r *http.Request, state string) (*spotify.Client, error) {
	token, err := authClient.Token(r.Context(), state, r)
	if err != nil {
		http.Error(w, "Couldn't get token", http.StatusForbidden)
		return nil, err
	}

	client := spotify.New(authClient.Client(r.Context(), token))
	SetClient(client)

	return client, nil
}
