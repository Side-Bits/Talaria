{
  description = "Talaria backend development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
    in
    {
      devShells = nixpkgs.lib.genAttrs systems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              go # Go compiler and standard tools
              gopls # Go language server
              gofumpt # Go formatter
              go-tools # Includes staticcheck
              delve # Go debugger
              air # hot reload
            ];
          };
        }
      );
    };
}
