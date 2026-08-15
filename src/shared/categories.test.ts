import { describe, expect, it } from "vitest"

import {
  parseHinataCategoryNav,
  parseNogiNewsCategoryNav,
  parseNogiScheduleCategoryNav,
  parseSakuraCategoryNav
} from "./categories"

describe("parseHinataCategoryNav()", () => {
  const html = `
    <ul class="p-category__list">
      <li class="p-category__item">
        <a class="c-button-category category_all" href="/s/official/media/list?ima=0000&dy=202608">ALL</a>
      </li>
      <li class="p-category__item">
        <a class="c-button-category category_shakehands" href="/s/official/media/list?ima=0000&cd=shakehands&dy=202608">ミート＆グリート</a>
      </li>
      <li class="p-category__item">
        <a class="c-button-category category_birth" href="/s/official/media/list?ima=0000&cd=birth&dy=202608">誕生日</a>
      </li>
    </ul>`

  it("parses the nav, skipping the ALL link", () => {
    expect(parseHinataCategoryNav(html)).toEqual({
      birth: "誕生日",
      shakehands: "ミート＆グリート"
    })
  })

  it("returns an empty object when the nav is absent", () => {
    expect(parseHinataCategoryNav("<html></html>")).toEqual({})
  })
})

describe("parseSakuraCategoryNav()", () => {
  const html = `
    <div class="com-hero-nav">
      <ul>
        <li class="cate-all active"><a href="/s/s46/media/list?ima=0000&dy=202608">ALL</a></li>
        <li class="cate-birthday"><a href="/s/s46/media/list?ima=0000&cd=birthday&dy=01">誕生日</a></li>
        <li class="cate-member memberselect-modal"><a href="#">メンバーを選択</a></li>
      </ul>
    </div>`

  it("parses the nav, skipping the ALL and member-select links", () => {
    expect(parseSakuraCategoryNav(html)).toEqual({ birthday: "誕生日" })
  })

  it("returns an empty object when the nav is absent", () => {
    expect(parseSakuraCategoryNav("<html></html>")).toEqual({})
  })
})

describe("parseNogiNewsCategoryNav()", () => {
  const html = `
    <div class="cat_sel_list">
      <ul>
        <li><a href="#" data-param="ct" data-value="">ALL</a></li>
        <li><a href="#" data-param="ct" data-value="tv">テレビ</a></li>
      </ul>
    </div>`

  it("parses the nav, skipping the ALL link", () => {
    expect(parseNogiNewsCategoryNav(html)).toEqual({ tv: "テレビ" })
  })

  it("returns an empty object when the nav is absent", () => {
    expect(parseNogiNewsCategoryNav("<html></html>")).toEqual({})
  })
})

describe("parseNogiScheduleCategoryNav()", () => {
  const html = `
    <div class="m--filbtn__bd">
      <div class="m--filbtn__one js-catLink">
        <input class="js-catLink-data" type="radio" name="ct" value="" id="ct-all">
        <button type="button" name="ALL"><label for="ct-all">ALL</label></button>
      </div>
      <div class="m--filbtn__one js-catLink">
        <input class="js-catLink-data" type="radio" name="ct" value="meetandgreet" id="ct-meetandgreet">
        <button type="button" name="ミート&amp;グリート"><label for="ct-meetandgreet">ミート&グリート</label></button>
      </div>
      <div class="m--filbtn__one js-catLink">
        <input class="js-catLink-data" type="radio" name="ct" value="birthday" id="ct-birthday">
        <button type="button" name="誕生日"><label for="ct-birthday">誕生日</label></button>
      </div>
    </div>`

  it("parses the radio-input nav, skipping the ALL input", () => {
    expect(parseNogiScheduleCategoryNav(html)).toEqual({
      birthday: "誕生日",
      meetandgreet: "ミート&グリート"
    })
  })

  it("returns an empty object when the nav is absent", () => {
    expect(parseNogiScheduleCategoryNav("<html></html>")).toEqual({})
  })

  it("does not match the news nav markup", () => {
    expect(
      parseNogiScheduleCategoryNav(
        `<div class="cat_sel_list"><a data-param="ct" data-value="tv">テレビ</a></div>`
      )
    ).toEqual({})
  })
})
