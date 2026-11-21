{
  description = "Talaria frontend development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;

        config = {
          allowUnfree = true;
          android_sdk.accept_license = true;
        };
      };

      buildToolsVersion = "36.0.0";
      ndkVersion = "27.1.12297006";
      cmakeVersion = "3.22.1";

      android = pkgs.androidenv.composeAndroidPackages {
        platformVersions = [ "36" ];
        buildToolsVersions = [ buildToolsVersion ];

        includeNDK = true;
        ndkVersions = [ ndkVersion ];

        includeCmake = true;
        cmakeVersions = [ cmakeVersion ];

        includeEmulator = true;
        includeSystemImages = true;
        systemImageTypes = [ "google_apis" ];
        abiVersions = [ "x86_64" ];
      };

      androidSdk = android.androidsdk;
      sdkRoot = "${androidSdk}/libexec/android-sdk";

      androidToolPath = pkgs.lib.concatStringsSep ":" [
        "${sdkRoot}/platform-tools"
        "${sdkRoot}/emulator"
        "${sdkRoot}/cmake/${cmakeVersion}/bin"
      ];
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
          jdk17
          androidSdk

          # Editor tooling
          typescript-language-server
          vscode-langservers-extracted

          # Development and native builds
          watchman
          git
          python3
          pkg-config
          ninja
          gnumake
          gcc
          unzip
        ];

        JAVA_HOME = pkgs.jdk17.home;

        ANDROID_HOME = sdkRoot;
        ANDROID_SDK_ROOT = sdkRoot;
        ANDROID_NDK_HOME = "${sdkRoot}/ndk/${ndkVersion}";
        ANDROID_NDK_ROOT = "${sdkRoot}/ndk/${ndkVersion}";

        GRADLE_OPTS =
          "-Dorg.gradle.project.android.aapt2FromMavenOverride="
          + "${sdkRoot}/build-tools/${buildToolsVersion}/aapt2";

        shellHook = ''
          export PATH="${androidToolPath}:$PATH"
        '';
      };
    };
}
