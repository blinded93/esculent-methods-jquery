Rails.application.routes.draw do
  root 'home#index'
  resources :ingredient_amounts
  resources :ingredients
  resources :recipes
  resources :users
end
