# Changelog

## [0.8.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.7.0...utils-v0.8.0) (2026-08-16)


### ⚠ BREAKING CHANGES

* `ScheduleEvent` no longer has `group`, and `ScheduleGroup` is no longer exported.
* `Blog.uid`, `BlogWithHtml`, `NogiBlogSummary.uid`, `SakuraBlog.uid`, and `getUidFromUrl`'s return are now `string`, and the single-blog `fetch*`/`get*BlogUrl` functions take a `string` uid.

### Features

* Add news utils ([#74](https://github.com/sakamichi-blog-archive/sba-utils/issues/74)) ([56c49d7](https://github.com/sakamichi-blog-archive/sba-utils/commit/56c49d72b5a9e912d2720c709730fad742762577))
* Add single schedule event fetcher for Nogi ([#77](https://github.com/sakamichi-blog-archive/sba-utils/issues/77)) ([349ccfe](https://github.com/sakamichi-blog-archive/sba-utils/commit/349ccfe590a5f2405752a28c7e448d4e125389f4))


### Bug fixes

* Represent blog uid as string ([#59](https://github.com/sakamichi-blog-archive/sba-utils/issues/59)) ([c3d9073](https://github.com/sakamichi-blog-archive/sba-utils/commit/c3d907327c3d590c98770a8b29eb407c2ec2e555))


### Dependencies

* Bump pnpm to 11.20.0 ([#65](https://github.com/sakamichi-blog-archive/sba-utils/issues/65)) ([5ceba98](https://github.com/sakamichi-blog-archive/sba-utils/commit/5ceba98d247dcc88acad76f78425aade943415f8))
* Bump publint from 0.3.22 to 0.3.23 in the all-non-major group ([#68](https://github.com/sakamichi-blog-archive/sba-utils/issues/68)) ([3e8a947](https://github.com/sakamichi-blog-archive/sba-utils/commit/3e8a94774c561db73f158ae3d31701da56952a57))
* Bump the all-non-major group with 2 updates ([#64](https://github.com/sakamichi-blog-archive/sba-utils/issues/64)) ([507e4a3](https://github.com/sakamichi-blog-archive/sba-utils/commit/507e4a3ba8aec7e028dc4b231ac9673a1a83e58e))

## [0.7.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.6.0...utils-v0.7.0) (2026-08-05)


### Features

* Add getNogiScheduleEventUrl() and add day support to getSakuraScheduleUrl() ([#58](https://github.com/sakamichi-blog-archive/sba-utils/issues/58)) ([46f675a](https://github.com/sakamichi-blog-archive/sba-utils/commit/46f675a64f5c22efb16782cc01d08f2981ba5e68))


### Bug fixes

* **github:** Match github_actions ecosystem in auto-merge condition ([#56](https://github.com/sakamichi-blog-archive/sba-utils/issues/56)) ([2ae759e](https://github.com/sakamichi-blog-archive/sba-utils/commit/2ae759e3003b7d53cc8e89e62f3f88f4e8b44c99))

## [0.6.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.5.0...utils-v0.6.0) (2026-08-04)


### ⚠ BREAKING CHANGES

* Change schedule utils types ([#54](https://github.com/sakamichi-blog-archive/sba-utils/issues/54))

### Features

* Add schedule utils ([#53](https://github.com/sakamichi-blog-archive/sba-utils/issues/53)) ([d850cbe](https://github.com/sakamichi-blog-archive/sba-utils/commit/d850cbed1332cd4e34321ceadd4b50d020e3a38a))


### Bug fixes

* Change schedule utils types ([#54](https://github.com/sakamichi-blog-archive/sba-utils/issues/54)) ([4a1af60](https://github.com/sakamichi-blog-archive/sba-utils/commit/4a1af60cb7f2466d89dc7bcafb840fb37b327a2d))


### Dependencies

* Bump the all-non-major group with 2 updates ([#51](https://github.com/sakamichi-blog-archive/sba-utils/issues/51)) ([4d35bea](https://github.com/sakamichi-blog-archive/sba-utils/commit/4d35bea92dc138d8c152e359cbffce00b594c60b))

## [0.5.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.4.0...utils-v0.5.0) (2026-07-27)


### ⚠ BREAKING CHANGES

* Support for filtering blogs by member ([#47](https://github.com/sakamichi-blog-archive/sba-utils/issues/47))

### Features

* Filter blogs by date and page ([#46](https://github.com/sakamichi-blog-archive/sba-utils/issues/46)) ([945d3ee](https://github.com/sakamichi-blog-archive/sba-utils/commit/945d3ee23d3b050f285e464a72558cb11ba6d006))
* Support for filtering blogs by member ([#47](https://github.com/sakamichi-blog-archive/sba-utils/issues/47)) ([3b98071](https://github.com/sakamichi-blog-archive/sba-utils/commit/3b98071989ac80713442d4787b75cded9a4ef940))


### Dependencies

* Bump the all-non-major group with 2 updates ([#44](https://github.com/sakamichi-blog-archive/sba-utils/issues/44)) ([88dfea3](https://github.com/sakamichi-blog-archive/sba-utils/commit/88dfea345daf57a5bfa85f2f5eb4a1fcfe7e28b7))
* Bump the all-non-major group with 5 updates ([#48](https://github.com/sakamichi-blog-archive/sba-utils/issues/48)) ([277a9be](https://github.com/sakamichi-blog-archive/sba-utils/commit/277a9bedbc2974bd50f1798017daaa71cbd0a35c))

## [0.4.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.3.0...utils-v0.4.0) (2026-07-22)


### Features

* Expand Node.js support to LTS ([#38](https://github.com/sakamichi-blog-archive/sba-utils/issues/38)) ([16a06f6](https://github.com/sakamichi-blog-archive/sba-utils/commit/16a06f6b2747212291f60a6c8e80bc02666ded11))


### Dependencies

* bump the all-non-major group with 3 updates ([#40](https://github.com/sakamichi-blog-archive/sba-utils/issues/40)) ([f8c56c4](https://github.com/sakamichi-blog-archive/sba-utils/commit/f8c56c4a227d99843f77aec45b0652167f366d82))
* Bump tsdown from 0.22.4 to 0.22.5 in the all-non-major group ([#34](https://github.com/sakamichi-blog-archive/sba-utils/issues/34)) ([e3faf25](https://github.com/sakamichi-blog-archive/sba-utils/commit/e3faf25b481c9436da4955ec0cca6c2dfb67929a))
* bump tsdown from 0.22.5 to 0.22.7 in the all-non-major group ([#36](https://github.com/sakamichi-blog-archive/sba-utils/issues/36)) ([a85ee55](https://github.com/sakamichi-blog-archive/sba-utils/commit/a85ee5584ec90126cf2815dcb1de311c66f24f1b))
* Update dependencies ([#32](https://github.com/sakamichi-blog-archive/sba-utils/issues/32)) ([3b53860](https://github.com/sakamichi-blog-archive/sba-utils/commit/3b538609b6a828763bde2704c91db2a2c4f2991f))

## [0.3.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.2.0...utils-v0.3.0) (2026-07-08)


### ⚠ BREAKING CHANGES

* Add missing members ([#21](https://github.com/sakamichi-blog-archive/sba-utils/issues/21))

### Features

* Add missing members ([#21](https://github.com/sakamichi-blog-archive/sba-utils/issues/21)) ([b36f378](https://github.com/sakamichi-blog-archive/sba-utils/commit/b36f37858b57ff6984c7465b14df3c53fd97e130))

## [0.2.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.1.0...utils-v0.2.0) (2026-07-06)


### Features

* Add English names to members ([#19](https://github.com/sakamichi-blog-archive/sba-utils/issues/19)) ([6322630](https://github.com/sakamichi-blog-archive/sba-utils/commit/63226309f3730b2f8c3c688c1fcc1d32492a23f6))

## [0.1.0](https://github.com/sakamichi-blog-archive/sba-utils/compare/utils-v0.0.1...utils-v0.1.0) (2026-07-06)


### ⚠ BREAKING CHANGES

* Return { blog/blogs, html/js, url } from fetch functions, narrow public API

### Features

* Add blogs utils ([a8728ee](https://github.com/sakamichi-blog-archive/sba-utils/commit/a8728eee43b6812e215e448921049b72d16a9f94))
* Add custom error classes for fetch and parse errors ([fdaa8ee](https://github.com/sakamichi-blog-archive/sba-utils/commit/fdaa8ee695bdbe7446ac6bab68afc9a201f7bb01))
* Add shared datetime utils ([19f537e](https://github.com/sakamichi-blog-archive/sba-utils/commit/19f537ee286b6c1fe3847293ce98998c003e8e40))
* Add single blog fetchers for hinata and nogi ([38082d3](https://github.com/sakamichi-blog-archive/sba-utils/commit/38082d380fddf3788574dbe4eefea256dd832189))
* Export fetchSakuraBlogHtml, add ParseError guards, fill test gaps ([72a8e65](https://github.com/sakamichi-blog-archive/sba-utils/commit/72a8e65d6bd3cd9f3a3ea1e130006251ae1f4cdd))
* Mark Konoka Matsuda and Rika Satou as graduated ([8ae6330](https://github.com/sakamichi-blog-archive/sba-utils/commit/8ae6330bf2e819e9459fdfb55e7a7463bb68bdb5))
* Return { blog/blogs, html/js, url } from fetch functions, narrow public API ([efc339e](https://github.com/sakamichi-blog-archive/sba-utils/commit/efc339e5c7305df3c944619054aebde3472f4c7c))
* Set Konoka Matsuda's graduation date ([e132413](https://github.com/sakamichi-blog-archive/sba-utils/commit/e13241368dc145a91b98422e90e151b83d5338b6))
* Set Rika Satou's graduation date ([a6d6c2d](https://github.com/sakamichi-blog-archive/sba-utils/commit/a6d6c2d6aa8916517809b93625b1623894f61f19))


### Bug Fixes

* Filter public exports ([c94f219](https://github.com/sakamichi-blog-archive/sba-utils/commit/c94f2193711f6319d97def09554b14d44f4ba316))
* Fix moduleResolution and module in TSConfig ([85aa76d](https://github.com/sakamichi-blog-archive/sba-utils/commit/85aa76d30d273ebdc07ff7fcd465ec8a1f4c77e3))
* Throw ParseError for unexpected input in parseDatetimeJst() ([7baf8ed](https://github.com/sakamichi-blog-archive/sba-utils/commit/7baf8ed1a8fb78692b765cfc33ddb5529c7a1983))
* Throw ParseError when uid cannot be extracted from URL ([0e09fb7](https://github.com/sakamichi-blog-archive/sba-utils/commit/0e09fb7c07a894f6c948f209e3accd7301d12a21))
