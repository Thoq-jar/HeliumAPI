{ pkgs, ... }: {
  channel = "stable-23.11";

  packages = [];

  idx = {
    workspace = {
      onCreate = {
        install-deno = "curl -fsSL https://deno.land/install.sh | sh";
      };
    };
  };
}