{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation rec {
  pname = "bun";
  version = "1.1.10"; # replace with the desired version

  src = pkgs.fetchurl {
    url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-linux-x64.zip";
    sha256 = "89033f06da1a0c14651ff8f1f6a1fa5a55763b1ecc6ed58ccc773c4715421c7d"; # replace with the actual sha256 hash of the zip file
  };

  nativeBuildInputs = [ pkgs.unzip ];

  installPhase = ''
    mkdir -p $out/bin
    unzip $src -d $out/bin
    mv $out/bin/bun-linux-x64/bun $out/bin/bun
    chmod +x $out/bin/bun
    rm -r $out/bin/bun-linux-x64
  '';
}
