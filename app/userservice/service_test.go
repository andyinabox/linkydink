package userservice

import (
	"testing"
<<<<<<< HEAD
)

func Test_New(t *testing.T) {
	_ = NewUserService(t, &Config{})
=======

	"github.com/andyinabox/linkydink/app/userrepository"
)

func Test_New(t *testing.T) {
	r, err := userrepository.New(&userrepository.Config{
		DbFile: ":memory:",
	})
	if err != nil {
		t.Fatal(err.Error())
	}
	_ = New(&Config{
		UserDbPath: "db/usr",
	}, r)
>>>>>>> main
}
