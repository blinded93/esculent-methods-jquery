class RecipesController < ApplicationController
  before_action :create_favorited_recipe_service, only: [:favorited, :favorite]

  def index
    recipes = Recipe.by_favorites
    render json: recipes, status: 200
  end

  def show
    recipe = Recipe.find_by_id(params[:id])
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include:['ingredient_amounts.ingredient'],
           status: 200
  end

  def favorited
    if logged_in?
      @f.current_user = current_user
      @f.favorited?
    end
    render json: @f,
           status:200
  end

  def favorite
    if logged_in?
      @f.current_user = current_user
      @f.toggle_favorite
    else
      @f.errors[:loggedOut] = ("Must be logged in to do that")
    end
    render json: @f,
           status:200
  end

  private
    def create_favorited_recipe_service
      @f = FavoritedRecipeService.new(recipe_id:params[:recipe_id])
    end
end
