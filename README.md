# BNB Chain Documentation

This repository contains the official documentation for BNB Chain, hosted at [docs.bnbchain.org](https://docs.bnbchain.org).

## About BNB Chain

BNB Chain is a leading blockchain ecosystem designed to support the growing demands of the decentralized web (Web3). Offering a unique combination of speed, scalability, and affordability, BNB Chain has become a popular choice for developers building decentralized applications (DApps) and for users seeking to participate in the world of decentralized finance (DeFi).

## What's Included

This documentation covers:

- **BNB Smart Chain (BSC)**: A high-performance blockchain platform for scalable and user-friendly DApps
- **opBNB**: A layer-2 scaling solution for BNB Smart Chain
- **BNB Greenfield**: Decentralized storage infrastructure for the blockchain

## Building the Documentation

This site is built using [MkDocs](https://www.mkdocs.org/) with the [Material theme](https://squidfunk.github.io/mkdocs-material/).

### Prerequisites

- Python 3.x
- pip

### Installation

```bash
pip install mkdocs mkdocs-material mkdocs-video mkdocs-redirects
```

### Local Development

To preview the documentation locally:

```bash
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000`.

### Building

To build the static site:

```bash
mkdocs build
```

The built site will be in the `site/` directory.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch using GitHub Actions.

## Contributing

Contributions to improve the documentation are welcome! Please feel free to submit issues or pull requests.

## License

This documentation is part of the BNB Chain project.

## Links

- [BNB Chain Website](https://www.bnbchain.org)
- [BNB Chain GitHub](https://github.com/bnb-chain)
- [Documentation Site](https://docs.bnbchain.org)
