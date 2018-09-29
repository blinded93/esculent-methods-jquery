class HomeController < ApplicationController
  def index
    @recipes = Recipe.alphabetized
  end
end
