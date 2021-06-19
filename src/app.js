import { PLATFORM, inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { PostService } from "./common/services/post-service";
import { AuthService } from "./common/services/auth-service";
import { AuthorizeStep } from "./pipeline-steps/authorize-step";
import * as toastr from "toastr";

@inject(PostService, AuthService, EventAggregator)
export class App {
  constructor(PostService, AuthService, EventAggregator) {
    this.ea = EventAggregator;
    this.postService = PostService;
    this.authService = AuthService;
  }

  attached() {
    this.currentUser = this.authService.currentUser;
    this.subscription = this.ea.subscribe("user", (user) => {
      this.currentUser = this.authService.currentUser;
    });

    this.updateSideBar();

    this.postSubscription = this.ea.subscribe("post-updated", (updatedAt) => {
      this.updateSideBar();
    });

    this.toastSubscription = this.ea.subscribe("toast", (toast) => {
      toastr[toast.type](toast.message);
    });
  }

  updateSideBar() {
    this.postService
      .allTags()
      .then((data) => {
        this.tags = data.tags;
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });

    this.postService
      .allArchives()
      .then((data) => {
        this.archives = data.archives;
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "Blog";
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      {
        route: "",
        name: "home",
        moduleId: PLATFORM.moduleName("posts/index"),
        title: "All Posts",
      },
      {
        route: "post/:slug",
        name: "post-view",
        moduleId: PLATFORM.moduleName("posts/view"),
        title: "View posts",
      },
      {
        route: "tag/:tag",
        name: "tag-view",
        moduleId: PLATFORM.moduleName("posts/tag-view"),
        title: "View posts by tag",
      },
      {
        route: "archive/:archive",
        name: "archive-view",
        moduleId: PLATFORM.moduleName("posts/archive-view"),
        title: "View posts by archive",
      },
      {
        route: "login",
        name: "login",
        moduleId: PLATFORM.moduleName("auth/login"),
        title: "Log in",
      },
      {
        route: "signup",
        name: "signup",
        moduleId: PLATFORM.moduleName("auth/signup"),
        title: "Sign up",
      },
      {
        route: "create-post",
        name: "create-post",
        moduleId: PLATFORM.moduleName("posts/create"),
        title: "Create Post",
        settings: { auth: true },
      },
      {
        route: "post/:slug/edit",
        name: "post-edit",
        moduleId: PLATFORM.moduleName("posts/edit"),
        title: "Edit post",
        settings: { auth: true },
      },
    ]);
  }

  logout() {
    this.authService
      .logout()
      .then((data) => {
        this.ea.publish("user", null);
        this.ea.publish("toast", {
          type: "success",
          message: "you have successfully logged out",
        });
        this.router.navigateToRoute("home");
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });
  }

  detached() {
    this.subscription.dispose();
    this.postSubscription.dispose();
    this.toastSubscription.dispose();
  }
}
