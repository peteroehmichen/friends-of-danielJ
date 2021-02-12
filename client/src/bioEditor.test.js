import axios from "./axios";
import Spinner from "./spinner";
import React from "react";
import { render } from "@testing-library/react";

test('When no bio is passed to it, an "Add" button is rendered.', () => {});

test('When a bio is passed to it, an "Edit" button is rendered.', () => {});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.', () => {});

test('Clicking the "Save" button causes an ajax request. The request should not actually happen during your test. To prevent it from actually happening, you should mock axios.', () => {});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", () => {});
