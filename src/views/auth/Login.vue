<template>
  <div class="login">
    <WorkArea size="xsmall">
      <section class="login__introduction" v-if="!getLoggedInStatus">
        <h1>Wooo enchanté</h1>
        <h2>On se connecte ? (Haha)</h2>
      </section>
      <section class="login__actions" v-if="!getLoggedInStatus">
        <Button
          @click="onClick"
          :icon="getGoogleIcon"
          color="google"
          width="full"
          >Me connecter avec Google</Button
        >
      </section>
      <section class="login__legal" v-if="!getLoggedInStatus">
        En cliquant sur "Continuer avec Google / Microsoft / Email" ci-dessus,
        vous reconnaissez que vous avez lu et compris,
        <router-link :to="{ name: 'terms-and-conditions' }"
          >nos conditions d'utilisation</router-link
        >
        et notre
        <router-link :to="{ name: 'privacy' }"
          >politique de confidentialité</router-link
        >.
      </section>
      <section v-if="getLoggedInStatus" class="login__gotoonboarding">
        <Avatar
          v-if="getUserAvatar"
          :image="getUserAvatar"
          class="gotoonboarding__avatar"
        />
        <div class="gotoonboarding__username">
          Tu es déjà connecté <br />{{ getUser.displayName }}
        </div>
        <div class="gotoonboarding__action" v-if="!getUserExtendedProfile">
          <router-link class="link" :to="{ name: 'onboarding' }"
            ><Button>Configurer mon compte</Button></router-link
          >
        </div>
        <div class="gotoonboarding__action" v-else>
          <router-link class="link" :to="{ name: 'dashboard' }"
            ><Button>C'est parti</Button></router-link
          >
        </div>
      </section>
    </WorkArea>
  </div>
</template>

<script>
import Avatar from "../../components/molecules/user/Avatar.vue";
import Button from "../../components/atoms/buttons/Button.vue";
import WorkArea from "../../components/layouts/WorkArea.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Login",
  components: { WorkArea, Button, Avatar },
  computed: {
    ...mapGetters("auth", [
      "getLoggedInStatus",
      "getUser",
      "getUserExtendedProfile",
      "getUserAvatar"
    ]),

    getGoogleIcon: function(params) {
      return require("@/assets/images/ui/icons/google.png");
    }
  },
  methods: {
    ...mapActions({
      StoreAuthLogin: "auth/login"
    }),
    onClick: function() {
      this.StoreAuthLogin("google")
        .then(user => {
          console.log(user);
          if (this.getUserExtendedProfile) this.$router.push("dashboard");
          else this.$router.push("onboarding");
        })
        .catch(err => {
          this.$toasted.show("Il y a eu une erreur... réessayez", {
            position: "bottom-right",
            duration: 2000,
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  @include title-large;
}

h2 {
  @include title-small;
}

.login {
  @include padding-container-page;
}

.login__introduction {
  text-align: center;
  margin-bottom: $margin-large;
}

.login__actions {
  margin-bottom: $margin-large;
}

.login__legal {
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  @include text-xsmall;
}

.login__gotoonboarding {
}

.gotoonboarding__avatar {
  margin-right: auto;
  margin-left: auto;
  margin-bottom: $margin-default;
}

.gotoonboarding__username {
  text-align: center;
  @include title-xsmall;
  margin-bottom: $margin-large;
}

.gotoonboarding__action {
  text-align: center;
}

.link {
  @include link-reset;
}
</style>
