import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardCourse from './CardCourse';
import { act } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { testDescription, testId, testLongDescription, testTitle } from '../../../__mock__/mock-course';

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

describe('Card Course', () => {
    test('test Card and mount course data', async () => {
        render(<CardCourse title={testTitle} desc={testDescription} id={testId}/>);

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText(testDescription)).toBeInTheDocument()
    })

})